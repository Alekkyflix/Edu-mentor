# EduMentor AI: Migration to AWS Amplify

This guide outlines the steps to move your frontend from Vercel to **AWS Amplify Hosting**. This move will unify your stack on AWS, improve networking stability, and simplify environment management.

## 🚨 Critical Step: Deploy the Backend Hotfix First

Before moving the frontend, we must ensure the backend is actually returning valid responses. The "Offline" error you saw was a **500 Internal Server Error** caused by a python syntax overlap in the last update.

**Run these from your project root to fix the live AWS backend:**

1.  **Login**:
    ```bash
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 034362073127.dkr.ecr.us-east-1.amazonaws.com
    ```
2.  **Build**:
    ```bash
    docker build -t edumentor-backend:latest -f backend/Dockerfile .
    ```
3.  **Tag & Push**:
    ```bash
    docker tag edumentor-backend:latest 034362073127.dkr.ecr.us-east-1.amazonaws.com/edumentor-backend:latest
    docker push 034362073127.dkr.ecr.us-east-1.amazonaws.com/edumentor-backend:latest
    ```
4.  **Restart ECS**:
    ```bash
    aws ecs update-service --cluster edumentor-cluster-production --service edumentor-backend-service --force-new-deployment --region us-east-1
    ```

---

## 🛠️ Phase 1: Amplify Configuration

I have already updated your `amplify.yml` to handle the **Monorepo** structure correctly. It is now optimized for Next.js 14 SSR.

### Key Changes:

- **appRoot**: Set to `frontend` so Amplify knows where the Next.js app lives.
- **baseDirectory**: Set to `.next` for SSR compatibility.
- **Rewrites**: Added fallback rules for the API.

---

## ☁️ Phase 2: Connecting the Repo to AWS Amplify

1.  Log in to the **[AWS Amplify Console](https://console.aws.amazon.com/amplify/home)**.
2.  Click **"New App"** -> **"Host web app"**.
3.  Select your GitHub repository (`Alekkyflix/Edu-mentor`).
4.  **Monorepo Settings**:
    - Check "My app is a monorepo".
    - Enter `frontend` as the root directory.
5.  **Build Settings**:
    - Amplify will automatically detect the [amplify.yml](file:///home/flix/Desktop/Edumentor%20AI/amplify.yml) we just updated.
6.  **Environment Variables**:
    - Under "Advanced settings", add the following:
      - `NEXT_PUBLIC_API_URL`: `http://edumentor-alb-production.us-east-1.elb.amazonaws.com`
      - _(Note: Double check your ALB DNS name in the EC2 Console if this defaults to 404)_.
7.  **Deploy**.

---

## 🔍 Phase 3: Verification

Once the build finishes:

1.  Open the Amplify-generated URL.
2.  The status dot should be **Green** (Backend Online).
3.  Send a message. Since we fixed the `manager.py` syntax, the response should flow back successfully without timing out or erroring.

### Why this is better:

- **Same Network**: Amplify and ECS both live in AWS, reducing the "cross-cloud" latency that often hangs Vercel rewrites.
- **SSR Power**: Amplify Hosting is optimized specifically for Next.js 14 standalone output.
