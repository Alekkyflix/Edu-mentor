terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    # Replace with your bucket details
    bucket = "edumentor-bucket"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "EduMentor"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

module "networking" {
  source = "./modules/networking"

  vpc_cidr    = var.vpc_cidr
  environment = var.environment
  aws_region  = var.aws_region
}

module "database" {
  source = "./modules/database"

  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids
  db_name            = "edumentor"
  db_username        = var.db_username
  db_password        = var.db_password
  environment        = var.environment
  security_group_id  = module.networking.db_sg_id
}

module "backend" {
  source = "./modules/backend"

  vpc_id             = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids
  private_subnet_ids = module.networking.private_subnet_ids
  app_security_group = module.networking.app_sg_id
  db_endpoint        = module.database.endpoint
  db_username        = var.db_username
  db_password        = var.db_password
  environment        = var.environment
  image_tag          = var.backend_image_tag
}

module "frontend" {
  source = "./modules/frontend"

  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids
  alb_listener_arn   = module.backend.alb_listener_arn
  app_security_group = module.networking.app_sg_id
  environment        = var.environment
  image_tag          = var.frontend_image_tag

  # Pass outputs from backend module
  cluster_id         = module.backend.cluster_id
  execution_role_arn = module.backend.execution_role_arn
  task_role_arn      = module.backend.task_role_arn
}

module "monitoring" {
  source = "./monitoring"

  environment    = var.environment
  alb_arn_suffix = module.backend.alb_arn_suffix
}


