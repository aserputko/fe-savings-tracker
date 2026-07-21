terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# CloudFront and ACM are global services, but both the ACM certificate lookup and
# the S3 bucket require us-east-1 (CloudFront only accepts certificates issued in
# us-east-1). All three environments share this region; their state is kept apart
# using Terraform workspaces (dev / staging / production).
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Repo        = var.github_repository
    }
  }
}
