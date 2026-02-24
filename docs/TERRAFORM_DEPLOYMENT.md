# Terraform Deployment Guide 🚀

This guide provides step-by-step instructions for deploying the EduMentor AI infrastructure using Terraform, specifically addressing the S3 backend initialization.

---

## 🛑 The "Bucket" & "Key" Prompt Issue

When you ran `terraform init`, the terminal stopped and asked you for:

- `bucket` (The name of the S3 bucket)
- `key` (The path to the state file inside the bucket)

### ❓ Why did this happen?

Terraform uses a **backend** to store the state of your infrastructure (a record of what it has created).
In your `infrastructure/main.tf` file, you have an `s3` backend defined, but its variables are commented out:

```hcl
  backend "s3" {
    # Replace with your bucket details
    # bucket = "edumentor-terraform-state"
    # key    = "prod/terraform.tfstate"
    # region = "us-east-1"
  }
```

Because they are commented out, Terraform prompts you to type them manually.

---

## ✅ How to Fix It (Choose One Option)

### Option 1: Use Local State (Best if you don't have an AWS S3 bucket yet)

If you are just testing and haven't created an S3 bucket yet, you can store the state file on your computer.

1. Open `infrastructure/main.tf`.
2. Remove the `backend "s3"` block or change it to `backend "local" {}`.
   ```hcl
     # Use local state instead of S3
     backend "local" {}
   ```
3. Run `terraform init` again.

### Option 2: Provide the S3 details in the file (Best for Production)

If you _do_ have an S3 bucket created for Terraform state:

1. Open `infrastructure/main.tf`.
2. Uncomment the lines and put your actual S3 bucket name:
   ```hcl
     backend "s3" {
       bucket = "your-actual-s3-bucket-name"
       key    = "prod/terraform.tfstate"
       region = "us-east-1"
     }
   ```
3. Run `terraform init` again.

### Option 3: Provide them via command line

You can also pass the variables directly in the terminal without changing the file:

```bash
terraform init \
    -backend-config="bucket=your-actual-s3-bucket-name" \
    -backend-config="key=prod/terraform.tfstate" \
    -backend-config="region=us-east-1"
```

---

## 🛠️ Full Deployment Workflow

Once `terraform init` succeeds, follow these steps to deploy your infrastructure:

### 1. Initialize Terraform

Downloads the necessary provider plugins (like AWS).

```bash
terraform init
```

### 2. Format & Validate Your Code

Make sure your Terraform code has no syntax errors.

```bash
terraform fmt
terraform validate
```

### 3. Review the Deployment Plan

See what resources Terraform _will_ create before actually creating them. This will likely prompt you for variables like database passwords unless you provide a `.tfvars` file.

```bash
terraform plan
```

### 4. Apply the Changes

Deploy the AWS infrastructure. Type `yes` when prompted.

```bash
terraform apply
```

### 5. Destroy (Optional - When you are done)

If you want to tear down the infrastructure to save AWS costs:

```bash
terraform destroy
```

---

## 🔑 Passing Variables (Database Passwords, etc.)

During `terraform plan` or `terraform apply`, Terraform might ask you for variables like `db_password` or `environment`.

Instead of typing them manually every time, create a file named `terraform.tfvars` inside the `infrastructure` folder:
w
**`infrastructure/terraform.tfvars`**

```hcl
environment = "prod"
aws_region  = "us-east-1"
db_username = "edu_admin"
db_password = "AVerySecurePassword123!"
```

_(Note: Never commit `terraform.tfvars` to Git if it contains real passwords!)_
