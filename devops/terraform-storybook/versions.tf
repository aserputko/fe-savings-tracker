terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# CloudFront, ACM and IAM are global services, but the ACM certificate lookup
# and the S3 bucket both require us-east-1 (CloudFront only accepts
# certificates issued in us-east-1).
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
      Repo      = var.github_repository
    }
  }
}
