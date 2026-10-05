variable "aws_region" {
  description = "AWS region for the API and database."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "reddit-clone"
}

variable "vpc_cidr" {
  type    = string
  default = "10.40.0.0/16"
}

variable "database_name" {
  type    = string
  default = "reddit_clone"
}

variable "database_username" {
  type    = string
  default = "reddit_admin"
}

variable "database_instance_class" {
  description = "Use db.t4g.micro for low-cost development; choose a larger class for production load."
  type        = string
  default     = "db.t4g.micro"
}

variable "database_allocated_storage" {
  type    = number
  default = 20
}

variable "database_backup_days" {
  type    = number
  default = 7
}

variable "github_repository" {
  description = "GitHub repository HTTPS URL, for example https://github.com/org/repo."
  type        = string
}

variable "github_branch" {
  type    = string
  default = "main"
}

variable "codestar_connection_arn" {
  description = "An already-created and authorized CodeStar Connections GitHub connection ARN."
  type        = string
}

variable "amplify_github_access_token" {
  description = "GitHub personal access token used by Amplify to connect to the repository."
  type        = string
  sensitive   = true
}

variable "root_domain" {
  description = "Frontend root domain, without protocol or www."
  type        = string
}

variable "api_domain" {
  description = "API hostname, for example api.example.com."
  type        = string
}

variable "cloudflare_zone_id" {
  type = string
}

variable "access_token_secret" {
  type      = string
  sensitive = true
}

variable "qdrant_api_key" {
  type      = string
  sensitive = true
}

variable "qdrant_endpoint" {
  type = string
}

variable "openai_api_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "ecs_instance_type" {
  type    = string
  default = "t3.small"
}
