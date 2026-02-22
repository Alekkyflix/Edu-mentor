# EduMentor AI - Configuration Guide

This document provides a step-by-step walkthrough for configuring the **EduMentor AI** system. Follow these steps sequentially to set up your environment, credentials, and third-party services.

---

## Phase 1: AWS Setup (The Cloud Foundation)

### Step 1.1: Create an IAM User

**Why?** You should never use your AWS Root account for applications.

1.  Log in to the [AWS Console](https://console.aws.amazon.com/).
2.  Navigate to **IAM** > **Users** > **Create user**.
3.  Name: `edumentor-admin`.
4.  **Permissions**: Attach policies directly:
    - `AdministratorAccess` (For easiest setup)
    - _OR_ for specific production security: `AmazonBedrockFullAccess`, `AmazonECS_FullAccess`, `AmazonRDSFullAccess`, `CloudWatchFullAccess`.
5.  Create the user.

### Step 1.2: Generate Access Keys

**Why?** Your application needs these "passwords" to talk to AWS.

1.  Click on the newly created user `edumentor-admin`.
2.  Go to the **Security credentials** tab.
3.  Scroll to **Access keys**.
4.  Click **Create access key**.
5.  Select **Command Line Interface (CLI)**.
6.  **IMPORTANT**: Download the `.csv` file or copy the **Access Key ID** and **Secret Access Key** immediately. You cannot see the secret again.

"### Step 1.3: Enable Bedrock Models (CRITICAL)

**Why?** Amazon Nova models are not enabled by default.

1.  Go to the [Amazon Bedrock Console](https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1).
2.  In the left sidebar, verify you are in **us-east-1** (N. Virginia).
3.  Scroll down to **Model access**.
4.  Click **Manage model access** (orange button).
5.  Check the boxes for:
    - **Amazon**: Nova Lite, Nova Micro, Nova Pro.
6.  Click **Request model access**.
7.  _Wait a few minutes until Status changes to "Access granted"._

---

## Phase 2: Local Environment Configuration

### Step 2.1: Setup the `.env` File

**Why?** This file holds your secrets. It is ignored by Git so secrets aren't leaked.

1.  In the project root, duplicate the example file:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` in your editor.

### Step 2.2: Fill in the Variables

| Variable | Value / Instruction |
| ... | ... |
| `AWS_ACCESS_KEY_ID` | Paste the Key ID from Step 1.2. |
| `AWS_SECRET_ACCESS_KEY` | Paste the Secret Key from Step 1.2. |
| `AWS_REGION` | Leave as `us-east-1` (Bedrock is best supported here). |
| `NOVA_LITE_MODEL_ID` | Default: `us.amazon.nova-lite-v1:0` (Verify in Bedrock Console). |
| `DATABASE_URL` | For local dev: `postgresql://edumentor:password@localhost:5432/edumentor_db` |

---

## Phase 3: External Services

### Step 3.1: Sentry (Error Tracking)

**Why?** To see errors when they happen in the user's browser or backend.

1.  Sign up at [sentry.io](https://sentry.io/).
2.  Create a new **Python** project for Backend.
3.  Copy the **DSN** string (looks like `https://xyz@o1.ingest.sentry.io/123`).
4.  Paste into `.env` as `SENTRY_DSN`.
5.  (Optional) Create a **React** project for Frontend and add that DSN to `frontend/.env.local`.

---

## Phase 4: Verification

### Step 4.1: Test AWS Connection

Run this simple Python snippet to verify Bedrock access:

```python
# test_bedrock.py
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

client = boto3.client(
    'bedrock-runtime',
    region_name=os.getenv('AWS_REGION'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

print("Connection successful! Regions active.")
```

Run with `python3 test_bedrock.py`.
