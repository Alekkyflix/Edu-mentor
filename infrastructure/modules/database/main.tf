resource "aws_db_subnet_group" "default" {
  name       = "edumentor-db-subnet-group-${var.environment}"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "edumentor-db-subnet-group"
  }
}

resource "aws_db_instance" "default" {
  identifier        = "edumentor-db-${var.environment}"
  allocated_storage = 20
  storage_type      = "gp2"
  engine            = "postgres"
  engine_version    = "15.16"
  instance_class    = "db.t3.micro"
  username          = var.db_username
  password          = var.db_password
  db_name           = var.db_name
  
  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [var.security_group_id]
  
  skip_final_snapshot = true
  publicly_accessible = false
  
  tags = {
    Name = "edumentor-db"
  }
}

variable "vpc_id" {}
variable "private_subnet_ids" {}
variable "db_name" {}
variable "db_username" {}
variable "db_password" {}
variable "environment" {}
variable "security_group_id" {}

output "endpoint" { value = aws_db_instance.default.endpoint }
