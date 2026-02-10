# EduMentor AI - Deployment Strategy

## Overview

This document outlines the deployment architecture and strategies for taking EduMentor AI from local development to production in Nairobi schools.

---

## Deployment Phases

### Phase 1: Local Development (Current)
- **Environment**: Developer laptops
- **SDK**: Mock StrandsClient  
- **Database**: SQLite local files
- **Testing**: Manual testing with sample inputs

### Phase 2: AWS Development (Week 1-2 of Roadmap)
- **Environment**: AWS Cloud (dev account)
- **SDK**: Real AWS Bedrock integration
- **Database**: Amazon RDS (PostgreSQL)
- **Testing**: Automated unit/integration tests

### Phase 3: Staging (Week 3 of Roadmap)
- **Environment**: AWS Cloud (staging account)
- **Load**: 10-50 concurrent students
- **Purpose**: Beta testing with real students
- **Monitoring**: Full CloudWatch + logging

### Phase 4: Production (Post 30-Day Roadmap)
- **Environment**: AWS Cloud (production account)
- **Load**: 100+ students across multiple schools
- **Purpose**: Full deployment
- **SLA**: 99.5% uptime, <2s latency

---

## Architecture

### Backend (FastAPI)

```
┌─────────────────────────────────────────────────┐
│              Application Load Balancer          │
│         (AWS ALB - HTTPS, Auto-Scaling)         │
└─────────────────┬───────────────────────────────┘
                  │
     ┌────────────┴───────────┐
     │                        │
┌────▼─────┐          ┌──────▼──────┐
│  FastAPI │          │   FastAPI   │
│ Instance │          │  Instance   │
│   (EC2)  │          │    (EC2)    │
└────┬─────┘          └──────┬──────┘
     │                       │
     └──────────┬────────────┘
                │
        ┌───────▼──────────┐
        │  Amazon Bedrock  │
        │   (Nova Models)  │
        └───────┬──────────┘
                │
        ┌───────▼───────────┐
        │  Amazon RDS       │
        │  (PostgreSQL)     │
        │  Session Storage  │
        └───────────────────┘
```

### AWS Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **EC2** | Host FastAPI backend | t3.medium (2 vCPU, 4 GB RAM) |
| **ALB** | Load balancing + SSL | Health checks every 30s |
| **Bedrock** | Nova model inference | us-east-1 region |
| **RDS** | Session persistence | db.t3.micro PostgreSQL 15 |
| **CloudWatch** | Logging + monitoring | Logs retention: 7 days |
| **S3** | Configuration/prompts | Versioned bucket |
| **Secrets Manager** | API keys, DB passwords | Auto-rotation enabled |

---

## Deployment Steps

### 1. Infrastructure as Code (Terraform)

Create `infrastructure/main.tf`:

```hcl
provider "aws" {
  region = "us-east-1"
}

# VPC and Networking
resource "aws_vpc" "edumentor" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "edumentor-vpc"
  }
}

# EC2 Instance for Backend
resource "aws_instance" "backend" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2
  instance_type = "t3.medium"
  
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y python3 git
    pip3 install fastapi uvicorn boto3
    
    # Clone repo and start app
    cd /home/ec2-user
    git clone https://github.com/your-org/edumentor-ai.git
    cd edumentor-ai
    pip3 install -r requirements.txt
    uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
  EOF
  
  tags = {
    Name = "edumentor-backend"
  }
}

# RDS Database
resource "aws_db_instance" "sessions" {
  identifier        = "edumentor-sessions"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  
  username = "edumentor_admin"
  password = var.db_password  # From variables
  
  skip_final_snapshot = true
}
```

Deploy:
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

### 2. Containerization (Docker)

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY backend/ ./backend/
COPY edumentor_ai/ ./edumentor_ai/

# Expose port
EXPOSE 8000

# Start server
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and push:
```bash
docker build -t edumentor-backend:latest .
docker tag edumentor-backend:latest your-ecr-repo/edumentor-backend:latest
docker push your-ecr-repo/edumentor-backend:latest
```

### 3. CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Run tests
        run: |
          pip install -r requirements.txt
          pytest tests/
      
      - name: Build Docker image
        run: docker build -t edumentor-backend .
      
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin your-ecr-repo
          docker tag edumentor-backend:latest your-ecr-repo/edumentor-backend:latest
          docker push your-ecr-repo/edumentor-backend:latest
      
      - name: Deploy to ECS
        run: aws ecs update-service --cluster edumentor --service backend --force-new-deployment
```

---

## Configuration Management

### Environment Variables

**Development** (`.env.dev`):
```bash
ENVIRONMENT=development
AWS_REGION=us-east-1
BEDROCK_ENDPOINT=https://bedrock-runtime.us-east-1.amazonaws.com
DATABASE_URL=sqlite:///dev.db
LOG_LEVEL=DEBUG
```

**Production** (`.env.prod`):
```bash
ENVIRONMENT=production
AWS_REGION=us-east-1
BEDROCK_ENDPOINT=https://bedrock-runtime.us-east-1.amazonaws.com
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/edumentor
LOG_LEVEL=INFO
SENTRY_DSN=https://your-sentry-dsn
```

Load via AWS Secrets Manager in production:
```python
import boto3
import json

def load_secrets():
    client = boto3.client('secretsmanager', region_name='us-east-1')
    response = client.get_secret_value(SecretId='edumentor/prod')
    return json.loads(response['SecretString'])
```

---

## Scaling Strategy

### Auto-Scaling Rules

```yaml
# AWS Auto Scaling Policy
MinInstances: 2
MaxInstances: 10
TargetCPU: 70%
TargetResponseTime: 2000ms

ScaleUp:
  When: CPU > 70% for 5 minutes
  Action: Add 2 instances
  
ScaleDown:
  When: CPU < 30% for 10 minutes
  Action: Remove 1 instance
```

### Cost Estimates

**Monthly costs for 100 students (30 sessions/student)**:

| Service | Usage | Cost |
|---------|-------|------|
| EC2 (2x t3.medium) | 720 hrs/month | ~$60 |
| RDS (db.t3.micro) | 720 hrs/month | ~$15 |
| Bedrock (Nova) | ~300K tokens | ~$50 |
| CloudWatch | 5GB logs | ~$3 |
| Data Transfer | ~50GB | ~$5 |
| **Total** | | **~$133/month** |

**Scaling to 1000 students**: ~$800/month

---

## Monitoring & Alerts

### CloudWatch Dashboards

Track:
- API latency (P50, P95, P99)
- Error rates by endpoint
- Bedrock token usage
- Active sessions
- Database connection pool

### Alerts

Set up SNS notifications for:
- Error rate > 1%
- Latency > 3 seconds
- CPU > 80%
- Database connections > 90% of pool
- Daily cost > $10

---

## Security

### Best Practices

1. **IAM Roles**: Least-privilege access
2. **Encryption**: TLS 1.3 for all traffic, RDS encryption at rest
3. **Secrets**: Never commit credentials, use AWS Secrets Manager
4. **VPC**: Private subnets for backend, public for ALB only
5. **WAF**: Rate limiting (100 requests/min per IP)
6. **Compliance**: GDPR/FERPA for student data

### Student Data Protection

- PII encryption at rest and in transit
- Session data retention: 90 days
- Anonymize data for analytics
- Parental consent for students under 18

---

## Rollback Strategy

If production deployment fails:

```bash
# Immediate rollback to previous Docker image
aws ecs update-service --cluster edumentor --service backend \
  --task-definition edumentor-backend:PREVIOUS_VERSION

# Or use Terraform
terraform apply -target=aws_instance.backend -var="image_version=v1.2.3"
```

---

## Launch Checklist

- [ ] AWS account configured with Bedrock access
- [ ] Terraform infrastructure deployed
- [ ] Database migrations run
- [ ] Secrets stored in AWS Secrets Manager
- [ ] CI/CD pipeline tested
- [ ] Load testing completed (100+ concurrent users)
- [ ] Monitoring dashboards created
- [ ] Alert thresholds configured
- [ ] SSL certificate installed
- [ ] Custom domain configured (e.g., api.edumentor.ke)
- [ ] Backup strategy implemented (daily RDS snapshots)
- [ ] Disaster recovery plan documented
- [ ] Security audit passed
- [ ] Cost alerts configured

---

## Post-Launch

- Daily monitoring of error rates and latency
- Weekly cost review
- Monthly student feedback analysis
- Quarterly model performance evaluation (switch Nova models if better options available)

---

**Last Updated**: 2026-02-10  
**Owner**: DevOps + Backend Team
