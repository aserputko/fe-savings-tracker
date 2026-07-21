data "aws_caller_identity" "current" {}

locals {
  # Per-environment subdomain. Production has no suffix, dev/staging append -dev/-stg.
  #   dev        -> savings-tracker-webapp-dev.aserputko.com
  #   staging    -> savings-tracker-webapp-stg.aserputko.com
  #   production -> savings-tracker-webapp.aserputko.com
  subdomain = {
    dev        = "${var.project_name}-dev"
    staging    = "${var.project_name}-stg"
    production = var.project_name
  }[var.environment]

  # Public URL served by CloudFront (covered by the *.aserputko.com wildcard cert).
  domain_name = "${local.subdomain}.${var.root_domain}"

  # Human-friendly base name for per-environment resources (OAC, IAM role).
  name_prefix = local.subdomain

  # S3 bucket names are globally unique across ALL AWS accounts, so append the
  # account id. The clean name is still used for the public domain above.
  bucket_name = "${local.subdomain}-${data.aws_caller_identity.current.account_id}"

  # GitHub Actions OIDC subject. The deploy job runs with `environment: <env>`,
  # which produces sub = repo:<owner>/<repo>:environment:<env>.
  github_oidc_subject = "repo:${var.github_repository}:environment:${var.environment}"
}
