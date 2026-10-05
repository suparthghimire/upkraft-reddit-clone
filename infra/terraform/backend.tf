locals {
  parameter_prefix = "/${var.project_name}/production"
  frontend_origins = ["https://${var.root_domain}", "https://www.${var.root_domain}"]
  runtime_secret_values = {
    DATABASE_URL        = "postgresql://${var.database_username}:${urlencode(random_password.database.result)}@${aws_db_instance.main.address}/${var.database_name}?sslmode=require"
    ACCESS_TOKEN_SECRET = var.access_token_secret
    QDRANT_API_KEY      = var.qdrant_api_key
    QDRANT_ENDPOINT     = var.qdrant_endpoint
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "uploads" {
  bucket        = "${var.project_name}-uploads-${random_id.bucket_suffix.hex}"
  force_destroy = false
  tags          = { Name = "${var.project_name}-uploads" }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_cors_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD", "PUT"]
    allowed_origins = concat(
      local.frontend_origins,
      ["https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.frontend.default_domain}"]
    )
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

resource "aws_ecr_repository" "api" {
  name                 = "${var.project_name}-api"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration { scan_on_push = true }
  encryption_configuration { encryption_type = "AES256" }
}

resource "aws_ecr_lifecycle_policy" "api" {
  repository = aws_ecr_repository.api.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep the most recent 20 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 20
      }
      action = { type = "expire" }
    }]
  })
}

resource "aws_ssm_parameter" "runtime_config" {
  for_each = {
    NODE_ENV                = "production"
    WHITE_LISTED_FE_ORIGINS = join(",", local.frontend_origins)
    AWS_REGION              = var.aws_region
    AWS_BUCKET_NAME         = aws_s3_bucket.uploads.bucket
  }
  name  = "${local.parameter_prefix}/${each.key}"
  type  = "String"
  value = each.value
}

resource "aws_ssm_parameter" "runtime_secrets" {
  for_each = toset(["DATABASE_URL", "ACCESS_TOKEN_SECRET", "QDRANT_API_KEY", "QDRANT_ENDPOINT"])
  name     = "${local.parameter_prefix}/${each.key}"
  type     = "SecureString"
  key_id   = aws_kms_key.runtime_secrets.arn
  value    = local.runtime_secret_values[each.key]
}

resource "aws_ssm_parameter" "openai_api_key" {
  count  = var.openai_api_key == "" ? 0 : 1
  name   = "${local.parameter_prefix}/OPENAI_API_KEY"
  type   = "SecureString"
  key_id = aws_kms_key.runtime_secrets.arn
  value  = var.openai_api_key
}

resource "aws_kms_key" "runtime_secrets" {
  description             = "Encrypt ${var.project_name} runtime parameters in SSM Parameter Store"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  tags                    = { Name = "${var.project_name}-runtime-secrets" }
}

resource "aws_kms_alias" "runtime_secrets" {
  name          = "alias/${var.project_name}-runtime-secrets"
  target_key_id = aws_kms_key.runtime_secrets.key_id
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/${var.project_name}/api"
  retention_in_days = 30
}

resource "aws_iam_role" "ecs_instance" {
  name = "${var.project_name}-ecs-instance"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{ Effect = "Allow", Principal = { Service = "ec2.amazonaws.com" }, Action = "sts:AssumeRole" }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_instance" {
  role       = aws_iam_role.ecs_instance.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs" {
  name = "${var.project_name}-ecs"
  role = aws_iam_role.ecs_instance.name
}

resource "aws_iam_role" "task_execution" {
  name = "${var.project_name}-task-execution"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{ Effect = "Allow", Principal = { Service = "ecs-tasks.amazonaws.com" }, Action = "sts:AssumeRole" }]
  })
}

resource "aws_iam_role_policy_attachment" "task_execution" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "task_secrets" {
  name = "read-app-parameters"
  role = aws_iam_role.task_execution.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["ssm:GetParameters", "ssm:GetParameter"]
      Resource = "arn:aws:ssm:${var.aws_region}:*:parameter${local.parameter_prefix}/*"
      }, {
      Effect   = "Allow"
      Action   = ["kms:Decrypt"]
      Resource = aws_kms_key.runtime_secrets.arn
    }]
  })
}

resource "aws_iam_role" "task" {
  name = "${var.project_name}-api-task"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{ Effect = "Allow", Principal = { Service = "ecs-tasks.amazonaws.com" }, Action = "sts:AssumeRole" }]
  })
}

resource "aws_iam_role_policy" "task_s3" {
  name = "access-upload-bucket"
  role = aws_iam_role.task.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:PutObject"]
      Resource = "${aws_s3_bucket.uploads.arn}/*"
    }]
  })
}

resource "aws_launch_template" "ecs" {
  name_prefix            = "${var.project_name}-ecs-"
  image_id               = data.aws_ssm_parameter.ecs_ami.value
  instance_type          = var.ecs_instance_type
  vpc_security_group_ids = [aws_security_group.ecs_instances.id]
  iam_instance_profile { name = aws_iam_instance_profile.ecs.name }
  user_data = base64encode("#!/bin/bash\necho ECS_CLUSTER=${aws_ecs_cluster.api.name} >> /etc/ecs/ecs.config\necho ECS_ENABLE_CONTAINER_METADATA=true >> /etc/ecs/ecs.config\n")

  tag_specifications {
    resource_type = "instance"
    tags          = { Name = "${var.project_name}-ecs" }
  }
}

resource "aws_autoscaling_group" "ecs" {
  name                = "${var.project_name}-ecs"
  min_size            = 1
  max_size            = 2
  desired_capacity    = 1
  vpc_zone_identifier = aws_subnet.public[*].id
  launch_template {
    id      = aws_launch_template.ecs.id
    version = "$Latest"
  }
  tag {
    key                 = "AmazonECSManaged"
    value               = true
    propagate_at_launch = true
  }
}

resource "aws_ecs_cluster" "api" {
  name = "${var.project_name}-cluster"
}

resource "aws_ecs_capacity_provider" "api" {
  name = "${var.project_name}-ec2"
  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.ecs.arn
    managed_scaling {
      status                    = "ENABLED"
      target_capacity           = 100
      minimum_scaling_step_size = 1
      maximum_scaling_step_size = 2
    }
    managed_termination_protection = "DISABLED"
  }
}

resource "aws_ecs_cluster_capacity_providers" "api" {
  cluster_name       = aws_ecs_cluster.api.name
  capacity_providers = [aws_ecs_capacity_provider.api.name]
  default_capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.api.name
    weight            = 1
  }
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${var.project_name}-api"
  requires_compatibilities = ["EC2"]
  network_mode             = "bridge"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.task_execution.arn
  task_role_arn            = aws_iam_role.task.arn
  container_definitions = jsonencode([{
    name         = "backend"
    image        = "${aws_ecr_repository.api.repository_url}:latest"
    essential    = true
    portMappings = [{ containerPort = 5005, hostPort = 0, protocol = "tcp" }]
    secrets = concat(
      [for name in ["DATABASE_URL", "ACCESS_TOKEN_SECRET", "QDRANT_API_KEY", "QDRANT_ENDPOINT"] : {
        name      = name
        valueFrom = aws_ssm_parameter.runtime_secrets[name].arn
      }],
      [for name in ["NODE_ENV", "WHITE_LISTED_FE_ORIGINS", "AWS_REGION", "AWS_BUCKET_NAME"] : {
        name      = name
        valueFrom = aws_ssm_parameter.runtime_config[name].arn
      }],
      var.openai_api_key == "" ? [] : [{ name = "OPENAI_API_KEY", valueFrom = aws_ssm_parameter.openai_api_key[0].arn }]
    )
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.api.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "api"
      }
    }
  }])
}
