output "s3_bucket_name" {
  description = "Bucket that stores the Storybook build. Set as the S3_BUCKET GitHub variable."
  value       = aws_s3_bucket.storybook.bucket
}

output "cloudfront_distribution_id" {
  description = "Set as the CLOUDFRONT_DISTRIBUTION_ID GitHub variable."
  value       = aws_cloudfront_distribution.storybook.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain — the target of the GoDaddy CNAME record."
  value       = aws_cloudfront_distribution.storybook.domain_name
}

output "deploy_role_arn" {
  description = "IAM role for GitHub Actions. Set as the AWS_ROLE_ARN GitHub variable."
  value       = aws_iam_role.storybook_deploy.arn
}

output "storybook_url" {
  description = "Public Storybook URL (after the GoDaddy CNAME is in place)."
  value       = "https://${var.domain_name}"
}

output "godaddy_cname_record" {
  description = "DNS record to create manually in the GoDaddy zone of the root domain."
  value = {
    type  = "CNAME"
    host  = trimsuffix(var.domain_name, ".${var.root_domain}")
    value = aws_cloudfront_distribution.storybook.domain_name
    ttl   = "600 (or GoDaddy default)"
  }
}
