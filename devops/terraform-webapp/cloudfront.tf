# Existing wildcard certificate for *.aserputko.com.
# CloudFront requires the certificate to be ISSUED in us-east-1.
data "aws_acm_certificate" "wildcard" {
  domain      = var.acm_certificate_domain
  statuses    = ["ISSUED"]
  most_recent = true
}

# AWS managed cache policy: CachingOptimized (gzip/brotli aware, no cookies/query forwarding).
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_origin_access_control" "webapp" {
  name                              = "${local.name_prefix}-oac"
  description                       = "OAC for the ${local.name_prefix} S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Access logging is intentionally disabled: the origin is a public, anonymous,
# static single-page app (auth happens client-side against the API, no PII is
# stored in the bucket). CloudFront metrics still provide request/error/cache
# visibility, and enabling S3 standard logs would only add a log bucket +
# lifecycle + cost with no security benefit here.
# checkov:skip=CKV_AWS_86: Public static SPA — access logs not required.
# tfsec:ignore:aws-cloudfront-enable-logging Public static SPA — access logs not required.
resource "aws_cloudfront_distribution" "webapp" {
  enabled             = true
  comment             = "${var.project_name} (${var.environment}) for ${var.github_repository}"
  default_root_object = "index.html"
  aliases             = [local.domain_name]
  price_class         = "PriceClass_100" # US, Canada, Europe — cheapest tier
  is_ipv6_enabled     = true

  origin {
    domain_name              = aws_s3_bucket.webapp.bucket_regional_domain_name
    origin_id                = "s3-webapp"
    origin_access_control_id = aws_cloudfront_origin_access_control.webapp.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-webapp"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  # This is a client-side-routed SPA. S3+OAC returns 403 for unknown keys (deep
  # links like /goals/123), so serve index.html and let React Router handle the
  # route. 404 is mapped as well for completeness.
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 60
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 60
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.wildcard.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
