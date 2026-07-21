output "environment" {
  description = "The environment this state/workspace manages (dev | staging | production)."
  value       = var.environment
}

output "s3_bucket_name" {
  description = "Bucket that stores the web app build. Set as the S3_BUCKET GitHub Environment variable."
  value       = aws_s3_bucket.webapp.bucket
}

output "cloudfront_distribution_id" {
  description = "Set as the CLOUDFRONT_DISTRIBUTION_ID GitHub Environment variable."
  value       = aws_cloudfront_distribution.webapp.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain — the target of the GoDaddy CNAME record for this environment."
  value       = aws_cloudfront_distribution.webapp.domain_name
}

output "deploy_role_arn" {
  description = "IAM role for GitHub Actions. Set as the AWS_ROLE_ARN GitHub Environment variable."
  value       = aws_iam_role.webapp_deploy.arn
}

output "webapp_url" {
  description = "Public web app URL for this environment (after the GoDaddy CNAME is in place)."
  value       = "https://${local.domain_name}"
}

output "godaddy_cname_record" {
  description = "DNS record to create manually in the GoDaddy zone of the root domain."
  value = {
    type  = "CNAME"
    host  = trimsuffix(local.domain_name, ".${var.root_domain}")
    value = aws_cloudfront_distribution.webapp.domain_name
    ttl   = "600 (or GoDaddy default)"
  }
}
