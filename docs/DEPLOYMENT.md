# EduMentor AI - Operational Runbook & Deployment Guide

## Overview

This document serves as the **single source of truth** for deploying, configuring, and maintaining the EduMentor AI system. It replaces previous deployment notes with actionable steps for a production-ready AWS Nova integration.

---

## 1. Prerequisites

Before you begin, ensure you have the following CLI tools installed:

- [Terraform](https://developer.hashicorp.com/terraform/downloads) (v1.5+)
- [AWS CLI](https://aws.amazon.com/cli/) (v2.0+)
- [Docker](https://docs.docker.com/get-docker/)

---

## 2. Configuration (The `.env` File)

The system relies on environment variables for credentials and configuration.

### Action Item:

1.  Copy the example file:
    ```bash
    cp .env.example .env
    ```
2.  **Fill in the `.env` file**. Here is what each field means and where to find it:

    | Variable                | Description           | Where to find it?                                                                                                                                       |
    | ----------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `AWS_ACCESS_KEY_ID`     | IAM User Access Key   | AWS Console -> IAM -> Users -> Security Credentials                                                                                                     |
    | `AWS_SECRET_ACCESS_KEY` | IAM User Secret       | Defined only when you create the key. **Generate a new one if lost.**                                                                                   |
    | `NOVA_*_MODEL_ID`       | Model IDs for Bedrock | Pre-filled with standard Nova IDs. Verify you have [Model Access](https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess). |
    | `DATABASE_URL`          | Connection string     | For **local**: `postgresql://user:pass@localhost:5432/db`. For **prod**: Output of Terraform.                                                           |
    | `SENTRY_DSN`            | Error Tracking URL    | Create a project at [sentry.io](https://sentry.io/) and copy the DSN (Client Keys).                                                                     |

---

## 3. Deployment (Infrastructure as Code)

We use Terraform to manage all AWS resources (VPC, ECS, RDS, CloudWatch).

### Step 3.1: Initialize

```bash
cd infrastructure
terraform init
```

### Step 3.2: Review Plan

```bash
terraform plan
```

_Review the output. It will show 20+ resources to be created._

### Step 3.3: Apply

```bash
terraform apply
```

_Type `yes` when prompted. This will take ~10-15 minutes._

### Step 3.4: Capture Outputs

Write down the outputs printed at the end:

- `alb_dns_name`: The URL of your load balancer (e.g., `edumentor-alb-1234.us-east-1.elb.amazonaws.com`)
- `db_endpoint`: The address of your RDS database.

---

## 4. Application Deployment (Docker)

Once infrastructure is ready, build and push your containers.

### Step 4.1: Login to ECR

(Terraform handles repo creation, assuming `your-repo` is replaced with actual ECR URL. **Note**: You may need to create an ECR repo manually or add it to Terraform if not using a public registry).

### Step 4.2: Build & Push Backend

```bash
cd backend
docker build -t your-registry/edumentor-backend:latest .
docker push your-registry/edumentor-backend:latest
```

### Step 4.3: Build & Push Frontend

```bash
cd frontend
docker build -t your-registry/edumentor-frontend:latest .
docker push your-registry/edumentor-frontend:latest
```

---

## 5. Monitoring & Observability

We have implemented a "glass box" monitoring strategy.

### Dashboards

- Go to [CloudWatch Dashboards](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:)
- Open `EduMentor-Dashboard-production`
- **What to look for**:
  - **Backend CPU**: Should be < 60%.
  - **Latency (P95)**: Should be < 2 seconds.

### Logs

- **FastAPI Logs**: CloudWatch Log Group `/ecs/edumentor-backend`
- **Next.js Logs**: CloudWatch Log Group `/ecs/edumentor-frontend`
- **App Logs**: Filter by `"level": "ERROR"` to see Sentry alerts.

### AI Token Usage

Search CloudWatch Logs for `[StrandsSDK] Usage` to see:

- Input tokens (Cost)
- Output tokens (Cost)
- Latency per agent

---

## 6. Local Development

To run locally with the real AWS connection:

```bash
# 1. Start Database (if using local Postgres)
docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres

# 2. Run Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# 3. Run Frontend
cd frontend
npm run dev
```

The system will connect to **Real AWS Bedrock** using the credentials in your `.env` file.
