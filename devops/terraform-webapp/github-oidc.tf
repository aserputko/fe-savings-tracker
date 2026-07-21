# The GitHub OIDC identity provider is account-wide (one per AWS account) and is
# already created/managed by the Storybook stack (devops/terraform/github-oidc.tf).
# We only *reference* it here as a data source — this stack never manages it — so
# the two stacks don't fight over the same global resource.
#
# In a fresh account where the provider does not exist yet, create it once (apply
# the Storybook stack, or import it there) before applying this stack.
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

# Trust policy: only this repo's GitHub Actions runs that target the matching
# GitHub Environment may assume the role. The deploy workflow sets
# `environment: <env>`, producing sub = repo:<owner>/<repo>:environment:<env>.
# Each environment therefore gets its own isolated role.
data "aws_iam_policy_document" "github_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [data.aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [local.github_oidc_subject]
    }
  }
}

resource "aws_iam_role" "webapp_deploy" {
  name               = "${local.name_prefix}-deploy"
  description        = "Assumed by GitHub Actions to deploy the ${var.environment} web app to S3 + CloudFront"
  assume_role_policy = data.aws_iam_policy_document.github_trust.json
}

# Least privilege: sync this environment's bucket, invalidate its distribution.
data "aws_iam_policy_document" "webapp_deploy" {
  statement {
    sid       = "ListBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.webapp.arn]
  }

  statement {
    sid    = "SyncObjects"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${aws_s3_bucket.webapp.arn}/*"]
  }

  statement {
    sid       = "InvalidateCache"
    effect    = "Allow"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [aws_cloudfront_distribution.webapp.arn]
  }
}

resource "aws_iam_role_policy" "webapp_deploy" {
  name   = "${local.name_prefix}-deploy"
  role   = aws_iam_role.webapp_deploy.id
  policy = data.aws_iam_policy_document.webapp_deploy.json
}
