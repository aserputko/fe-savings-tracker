data "aws_caller_identity" "current" {}

locals {
  bucket_name = "${var.project_name}-${data.aws_caller_identity.current.account_id}"
}

# Private bucket that stores the built Storybook (storybook-static/).
# It is never exposed publicly; CloudFront reads it through Origin Access Control.
#
# Server access logging is intentionally disabled: the bucket is fully private
# (BlockPublicAccess + BucketOwnerEnforced), the only reader is the CloudFront
# OAC principal scoped by AWS:SourceArn, and the contents are rebuildable static
# assets — no PII, no uploads, no secrets. Enabling S3 access logs would require
# a separate log bucket + lifecycle with no security benefit for this workload.
# checkov:skip=CKV_AWS_18: Private artifact bucket for public Storybook — access logs not required.
# tfsec:ignore:aws-s3-enable-bucket-logging Private artifact bucket for public Storybook — access logs not required.
resource "aws_s3_bucket" "storybook" {
  bucket = local.bucket_name
}

resource "aws_s3_bucket_public_access_block" "storybook" {
  bucket = aws_s3_bucket.storybook.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "storybook" {
  bucket = aws_s3_bucket.storybook.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Allow only this CloudFront distribution to read objects.
data "aws_iam_policy_document" "storybook_bucket_policy" {
  statement {
    sid       = "AllowCloudFrontOACRead"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.storybook.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.storybook.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "storybook" {
  bucket = aws_s3_bucket.storybook.id
  policy = data.aws_iam_policy_document.storybook_bucket_policy.json

  depends_on = [aws_s3_bucket_public_access_block.storybook]
}
