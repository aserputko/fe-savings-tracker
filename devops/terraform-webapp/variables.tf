variable "project_name" {
  description = "Base project name, used as a prefix for resource names and the production subdomain."
  type        = string
  default     = "savings-tracker-webapp"
}

variable "environment" {
  description = "Deployment environment. Drives the subdomain, bucket, CloudFront and IAM role names."
  type        = string

  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "environment must be one of: dev, staging, production."
  }
}

variable "aws_region" {
  description = "AWS region. Must be us-east-1 so CloudFront can use the ACM certificate."
  type        = string
  default     = "us-east-1"
}

variable "root_domain" {
  description = "Root domain managed in GoDaddy (used to build the env subdomain and the CNAME host in outputs)."
  type        = string
  default     = "aserputko.com"
}

variable "acm_certificate_domain" {
  description = "Domain of the existing wildcard ACM certificate (must be ISSUED in us-east-1)."
  type        = string
  default     = "*.aserputko.com"
}

variable "github_repository" {
  description = "GitHub repository (owner/name) allowed to assume the deploy role via OIDC."
  type        = string
  default     = "aserputko/fe-savings-tracker"
}
