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

---

## 4. Frontend Deployment (Primary: Vercel)

We use **Vercel** as the primary platform for the Next.js frontend because of its seamless integration with Next.js and high-performance CDN.

### Step 4.1: Connect Repository

1.  Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your git repository.
4.  **Configure Project Settings**:
    - **Framework Preset**: `Next.js`
    - **Root Directory**: `frontend`
    - **Build Command**: `npm run build`
    - **Output Directory**: `.next`

### Step 4.2: Environment Variables

Add the following in the Vercel Dashboard under **Project Settings** -> **Environment Variables**:

| Variable              | Value                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | The `alb_dns_name` or backend URL from Step 3.4 (e.g., `https://api.edumentor.ai/api`) |

### Step 4.3: Deploy

Click **Deploy**. Vercel will automatically build and deploy your application. Subsequent pushes to your git provider will trigger automatic deployments.

---

## 5. Alternate Frontend Deployment (AWS Amplify)

_Note: This is an alternate deployment method. As requested, we are keeping the configuration for future use._

We can also use **AWS Amplify Hosting** for the Next.js frontend. It provides automatic CI/CD and support for Next.js 14 SSR.

### Step 5.1: Connect Repository (Amplify)

1.  Log in to the [Amplify Console](https://console.aws.amazon.com/amplify/home).
2.  Click **New App** -> **Host web app**.
3.  Select your git provider and repository.

### Step 5.2: Build Settings (Amplify)

The console will automatically detect the `amplify.yml` in the root. If not, ensure it points to the `frontend` directory:

- **Base directory**: `frontend`
- **Build command**: `npm run build`

### Step 5.3: Environment Variables (Amplify)

Add the following in Amplify Console under **App settings** -> **Environment variables**:

| Variable              | Value                                           |
| --------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | The `alb_dns_name` or backend URL from Step 3.4 |

---

## 6. Backend Deployment (Docker / ECS)

If using ECS (via Terraform):

### Step 5.1: Login to ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

### Step 5.2: Build & Push

```bash
cd backend
docker build -t edumentor-backend:latest .
docker tag edumentor-backend:latest <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/edumentor-backend:latest
docker push <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/edumentor-backend:latest
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
python -m uvicorn app.main:app --reload


# 3. Run Frontend
cd frontend
npm run dev
```

The system will connect to **Real AWS Bedrock** using the credentials in your `.env` file.
