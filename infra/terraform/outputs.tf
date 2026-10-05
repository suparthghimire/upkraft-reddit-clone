output "api_url" {
  value = "https://${var.api_domain}"
}

output "frontend_url" {
  value = "https://${var.root_domain}"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.api.name
}

output "ecs_service_name" {
  value = aws_ecs_service.api.name
}

output "uploads_bucket_name" {
  value = aws_s3_bucket.uploads.bucket
}

output "amplify_certificate_verification_record" {
  description = "Add the returned CNAME record(s) to Cloudflare to complete Amplify domain verification."
  value       = aws_amplify_domain_association.frontend.certificate_verification_dns_record
}

output "amplify_default_domain" {
  value = aws_amplify_app.frontend.default_domain
}
