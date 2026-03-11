# EduMentor AI: Migration to AWS Amplify

This guide outlines the steps to move your frontend from Vercel to **AWS Amplify Hosting**. This move will unify your stack on AWS, improve networking stability, and simplify environment management.

## 🚨 Critical Step 1: Deploy the Backend Hotfix First

Before moving the frontend, we must ensure the backend is actually returning valid responses. The "Offline" error you saw was a **500 Internal Server Error** caused by a python syntax overlap in the last update.

**Run these from your project root to fix the live AWS backend:**

1.  **Login**:
    ```bash
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
    ```
2.  **Build**:
    ```bash
    docker build -t edumentor-backend:latest -f backend/Dockerfile .
    ```
3.  **Tag & Push**:
    ```bash
    docker tag edumentor-backend:latest <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/edumentor-backend:latest
    docker push <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/edumentor-backend:latest
    ```
4.  **Restart ECS**:
    ```bash
    aws ecs update-service --cluster edumentor-cluster-production --service edumentor-backend-service --force-new-deployment --region us-east-1
    ```

---

## 🛠️ Critical Step 2: The "Flat" Amplify Config

I have updated your `amplify.yml`. **You must push this to GitHub for the build to work.**

We are using a "Flat" configuration. This ensures Amplify detects the Next.js 14 SSR structure correctly even inside a monorepo.

**Push your changes now:**

```bash
git add amplify.yml docs/AMPLIFY_MIGRATION.md
git commit -m "fix: use flat amplify config and update migration guide"
git push origin main
```

---

## ☁️ Phase 3: AWS Amplify Console Setup

1.  Log in to the **[AWS Amplify Console](https://console.aws.amazon.com/amplify/home)**.
2.  **Service Role (IMPORTANT)**:
    - Go to **App Settings** -> **General**.
    - Look at **"Service role"**. Click **Edit**.
    - If you don't have one, create a role that gives Amplify permissions to manage resources. This is required for SSR to build the manifest.
3.  **Compute Role (IMPORTANT)**:
    - In the same **General** settings, ensure a **"Compute role"** is selected. If it says "No default role set", Amplify cannot deploy your Next.js server.
4.  **Environment Variables**:
    - Add `NEXT_PUBLIC_API_URL`: `http://edumentor-alb-production.us-east-1.elb.amazonaws.com`
5.  **Redeploy**:
    - After pushing the new `amplify.yml` to Git, click **"Redeploy this version"** in the build tab.

---

## 🔍 Verification

Once the build finishes:

1.  Open the Amplify URL.
2.  The status dot should be **Green** (Backend Online).
3.  Send a message. Since we fixed the `manager.py` syntax, the response should flow back successfully!
