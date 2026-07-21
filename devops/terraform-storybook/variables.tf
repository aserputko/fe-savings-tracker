variable "project_name" {
  description = "Project name, used as a prefix for all resource names."
  type        = string
  default     = "savings-tracker-storybook"
}

variable "aws_region" {
  description = "AWS region. Must be us-east-1 so CloudFront can use the ACM certificate."
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Custom domain that serves Storybook through CloudFront."
  type        = string
  default     = "saving-tracker-storybook.aserputko.com"
}

variable "root_domain" {
  description = "Root domain managed in GoDaddy (used to derive the CNAME host in outputs)."
  type        = string
  default     = "aserputko.com"
}

variable "acm_certificate_domain" {
  description = "Domain of the existing ACM certificate (must be ISSUED in us-east-1)."
  type        = string
  default     = "*.aserputko.com"
}

variable "github_repository" {
  description = "GitHub repository (owner/name) allowed to assume the deploy role via OIDC."
  type        = string
  default     = "aserputko/fe-savings-tracker"
}

variable "github_branch" {
  description = "Git branch allowed to deploy (applies to both push and workflow_dispatch runs)."
  type        = string
  default     = "main"
}
