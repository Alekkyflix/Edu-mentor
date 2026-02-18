resource "aws_lb" "main" {
  name               = "edumentor-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.app_security_group]
  subnets            = var.public_subnet_ids
}

resource "aws_lb_target_group" "backend" {
  name        = "edumentor-backend-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path = "/"
    enabled = true
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

resource "aws_ecs_cluster" "main" {
  name = "edumentor-cluster-${var.environment}"
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "edumentor-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "your-repo/edumentor-backend:${var.image_tag}"
      essential = true
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
        }
      ]
      environment = [
        { name = "DATABASE_URL", value = "postgres://${var.db_endpoint}" },
        { name = "AWS_REGION", value = "us-east-1" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/edumentor-backend"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
          "awslogs-create-group"  = "true"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "backend" {
  name            = "edumentor-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [var.app_security_group]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = 8000
  }
}

# --- IAM Roles (Simplified) ---
resource "aws_iam_role" "ecs_execution_role" {
  name = "edumentor_ecs_execution_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

# Attach policy to allow CloudWatch logs
resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Task Role (Access to Bedrock)
resource "aws_iam_role" "ecs_task_role" {
  name = "edumentor_ecs_task_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

# Allow Bedrock Access
resource "aws_iam_role_policy" "bedrock_access" {
  name = "bedrock_access"
  role = aws_iam_role.ecs_task_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["bedrock:*"]
        Resource = "*"
      }
    ]
  })
}

variable "vpc_id" {}
variable "public_subnet_ids" {}
variable "private_subnet_ids" {}
variable "app_security_group" {}
variable "db_endpoint" {}
variable "environment" {}
variable "image_tag" {}

output "alb_dns_name" { value = aws_lb.main.dns_name }
output "alb_arn_suffix" { value = aws_lb.main.arn_suffix }
output "alb_listener_arn" { value = aws_lb_listener.http.arn }
output "cluster_id" { value = aws_ecs_cluster.main.id }
output "execution_role_arn" { value = aws_iam_role.ecs_execution_role.arn }
output "task_role_arn" { value = aws_iam_role.ecs_task_role.arn }
