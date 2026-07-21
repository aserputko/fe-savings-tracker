# Private bucket that stores the built web app (dist/) for this environment.
# It is never exposed publicly; CloudFront reads it through Origin Access Control.
#
# Server access logging is intentionally disabled: the bucket is fully private
# (BlockPublicAccess + BucketOwnerEnforced), the only reader is the CloudFront
# OAC principal scoped by AWS:SourceArn, and the contents are rebuildable static
# assets — no PII, no uploads, no secrets. Enabling S3 access logs would require
# a separate log bucket + lifecycle with no security benefit for this workload.
# checkov:skip=CKV_AWS_18: Private artifact bucket for a public SPA — access logs not required.
# tfsec:ignore:aws-s3-enable-bucket-logging Private artifact bucket for a public SPA — access logs not required.
resource "aws_s3_bucket" "webapp" {
  bucket = local.bucket_name
}

resource "aws_s3_bucket_public_access_block" "webapp" {
  bucket = aws_s3_bucket.webapp.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "webapp" {
  bucket = aws_s3_bucket.webapp.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Allow only this environment's CloudFront distribution to read objects.
data "aws_iam_policy_document" "webapp_bucket_policy" {
  statement {
    sid       = "AllowCloudFrontOACRead"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.webapp.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.webapp.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "webapp" {
  bucket = aws_s3_bucket.webapp.id
  policy = data.aws_iam_policy_document.webapp_bucket_policy.json

  depends_on = [aws_s3_bucket_public_access_block.webapp]
}
