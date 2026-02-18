resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "EduMentor-Dashboard-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", "edumentor-backend-service", "ClusterName", "edumentor-cluster-${var.environment}"]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "Backend CPU"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", var.alb_arn_suffix]
          ]
          period = 300
          stat   = "p95"
          region = "us-east-1"
          title  = "Latency (P95)"
        }
      }
    ]
  })
}

resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "edumentor-high-cpu-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ec2 cpu utilization" 
  dimensions = {
    ServiceName = "edumentor-backend-service"
    ClusterName = "edumentor-cluster-${var.environment}"
  }
}

variable "environment" {}
variable "alb_arn_suffix" {}
