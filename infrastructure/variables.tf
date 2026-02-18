variable "aws_region" {
  description = "AWS Region to deploy to"
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  default     = "10.0.0.0/16"
}

variable "db_username" {
  description = "Database master username"
  default     = "edumentor_admin"
}

variable "db_password" {
  description = "Database master password"
  sensitive   = true
}

variable "backend_image_tag" {
  description = "Docker image tag for backend"
  default     = "latest"
}

variable "frontend_image_tag" {
  description = "Docker image tag for frontend"
  default     = "latest"
}
