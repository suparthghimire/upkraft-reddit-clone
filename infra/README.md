# Deployment setup

This directory contains the backend container setup and AWS deployment infrastructure.

## Local backend and database

From the repository root:

```sh
cp apps/server/.env.example apps/server/.env
# Edit apps/server/.env with valid Qdrant values. For local S3 calls, export
# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY (plus AWS_SESSION_TOKEN when needed)
# in the shell before starting Compose.
docker compose up --build
```

Compose starts PostgreSQL with a persistent volume, waits for it to become healthy, applies the Drizzle migrations, then starts the API on port `5005`. The migration service must finish successfully before the API starts. Use `docker compose down -v` only when you intend to delete the local database volume.

## AWS resources managed by Terraform

`terraform/` provisions:

- A two-AZ VPC, public subnets for the ALB and ECS EC2 hosts, and private subnets for RDS.
- A private PostgreSQL RDS instance with encrypted storage, backups, and deletion protection.
- An encrypted, private S3 uploads bucket with browser CORS for the configured frontend origins.
- ECR, an ECS EC2 cluster and service, an HTTPS ALB, and CloudWatch logs.
- SSM Parameter Store configuration and SecureString secrets encrypted with a dedicated KMS key. ECS reads these at task startup. S3 access uses the task IAM role; no static AWS keys are stored in the app environment.
- CodePipeline and CodeBuild. Each backend branch update builds and pushes the Docker image, runs migrations as a one-off ECS task using that image, then deploys it to the ECS service.
- Amplify Hosting for the Next.js monorepo app, plus Cloudflare DNS records for the API and frontend.

The ECS hosts are in public subnets to reach ECR and external API services without a NAT gateway. The RDS instance stays in private subnets, and its security group only accepts PostgreSQL from ECS.

## One-time prerequisites

1. Configure AWS CLI credentials and choose the AWS region.
2. Create a GitHub CodeStar Connection in AWS CodePipeline and complete its GitHub authorization. Put its ARN in `codestar_connection_arn`.
3. Create a Cloudflare API token with DNS edit access for the zone. Export it as `CLOUDFLARE_API_TOKEN` before running Terraform.
4. Create a GitHub token for Amplify repository access. This is a Terraform sensitive variable; state is still sensitive, so keep it in the encrypted remote backend below.
5. Provide the GitHub repository URL and branch, frontend root domain, API hostname, Cloudflare zone ID, Qdrant endpoint/key, and access-token signing secret.

## Terraform state bootstrap

The state bucket is created separately so application secrets never need to live in local Terraform state:

```sh
cd infra/state
terraform init
terraform apply -var='state_bucket_name=YOUR_GLOBALLY_UNIQUE_STATE_BUCKET'
```

Then configure the main stack:

```sh
cd ../terraform
cp backend.hcl.example backend.hcl
# Set bucket and region in backend.hcl to the state bucket and AWS region.
terraform init -backend-config=backend.hcl
cp terraform.tfvars.example terraform.tfvars
# Fill in the repo, branch, domains, connection ARN, Cloudflare zone, and Qdrant endpoint.
# Supply secrets with TF_VAR_access_token_secret, TF_VAR_qdrant_api_key,
# TF_VAR_amplify_github_access_token, and optionally TF_VAR_openai_api_key.
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

Do not commit `terraform.tfvars`, `backend.hcl`, Terraform state, or plan files. Terraform stores values for SecureString parameters and provider credentials in state, so use the encrypted versioned S3 backend and restrict its IAM access. The runtime KMS key is retained for 30 days after a destroy request; deleting it makes encrypted parameters and any retained copies unreadable.

## First deployment and DNS verification

The first Terraform apply creates the ECS service before an image exists in ECR. The first CodePipeline run builds and pushes the image, runs database migrations, then updates the service. Wait for that pipeline run to complete before expecting the API health check to pass.

Terraform creates the API DNS record and Amplify frontend CNAME targets in Cloudflare. After the first apply, read `amplify_certificate_verification_record` and add every returned CNAME verification record to the same Cloudflare zone with proxying disabled. Amplify can then issue its managed certificate and activate the custom domain. `terraform output frontend_url` and `terraform output api_url` show the configured hostnames.

## Notes

- The app currently requires `QDRANT_API_KEY` and `QDRANT_ENDPOINT`; both are populated from Parameter Store. `OPENAI_API_KEY` is optional and omitted when unset.
- The database uses a generated password. It is not printed as a Terraform output.
- RDS deletion protection is enabled. Backups and snapshots are retained by default; review those settings before production rollout.
- The infrastructure is scaffolded but has not been applied to an AWS account. Confirm the variables and inspect the Terraform plan before provisioning paid resources.
