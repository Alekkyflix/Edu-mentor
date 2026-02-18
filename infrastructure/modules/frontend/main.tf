resource "aws_lb_target_group" "frontend" {
  name        = "edumentor-frontend-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path = "/"
    enabled = true
  }
}

resource "aws_lb_listener_rule" "frontend" {
  listener_arn = var.alb_listener_arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "edumentor-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  
  execution_role_arn = var.execution_role_arn
  task_role_arn      = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "your-repo/edumentor-frontend:${var.image_tag}"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "NEXT_PUBLIC_API_URL", value = "/api" } # Relative path for proxying
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/edumentor-frontend"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
          "awslogs-create-group"  = "true"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "frontend" {
  name            = "edumentor-frontend-service"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [var.app_security_group]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = 3000
  }
}

variable "vpc_id" {}
variable "private_subnet_ids" {}
variable "alb_listener_arn" {}
variable "app_security_group" {}
variable "environment" {}
variable "image_tag" {}

# These variables need to be passed from the backend module or defined here?
# In main.tf, we didn't pass cluster_id/roles. fixing main.tf might be needed.
# For now, let's assume we pass them or look them up.
# Actually, better to pass them from main.tf. I will update main.tf instructions later or use data sources.
# Let's add them as expected variables.

variable "cluster_id" {
  description = "ECS Cluster ID from backend module"
}

variable "execution_role_arn" {
  description = "Execution Role ARN from backend module"
}

variable "task_role_arn" {
  description = "Task Role ARN from backend module"
}
