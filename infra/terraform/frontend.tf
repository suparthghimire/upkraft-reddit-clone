resource "aws_amplify_app" "frontend" {
  name         = "${var.project_name}-frontend"
  repository   = var.github_repository
  access_token = var.amplify_github_access_token
  platform     = "WEB_COMPUTE"
  build_spec   = file("${path.module}/amplify.yml")

  environment_variables = {
    NEXT_PUBLIC_BASE_SERVER_API_ENDPOINT = "https://${var.api_domain}/api"
    AMPLIFY_MONOREPO_APP_ROOT            = "apps/client/next"
  }
}

resource "aws_amplify_branch" "main" {
  app_id            = aws_amplify_app.frontend.id
  branch_name       = var.github_branch
  framework         = "Next.js - SSR"
  stage             = "PRODUCTION"
  enable_auto_build = true
}

resource "aws_amplify_domain_association" "frontend" {
  app_id                = aws_amplify_app.frontend.id
  domain_name           = var.root_domain
  wait_for_verification = false

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}

locals {
  amplify_dns_records = {
    for subdomain in aws_amplify_domain_association.frontend.sub_domain :
    (subdomain.prefix == "" ? var.root_domain : "${subdomain.prefix}.${var.root_domain}") => "${aws_amplify_branch.main.branch_name}.${aws_amplify_app.frontend.default_domain}"
  }
}

resource "cloudflare_record" "frontend" {
  for_each = local.amplify_dns_records
  zone_id  = var.cloudflare_zone_id
  name     = each.key
  type     = "CNAME"
  content  = each.value
  ttl      = 1
  proxied  = false
}
