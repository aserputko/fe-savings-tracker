# GitHub's OIDC identity provider. One per AWS account.
# If it already exists in account, import it instead of creating it:
#   terraform import aws_iam_openid_connect_provider.github \
#     arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com
resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  # AWS now validates GitHub's OIDC cert against trusted root CAs, but the API
  # still requires thumbprints. These are GitHub's published values.
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]
}

# Trust policy: only workflows in the configured repo running on the configured
# branch (push AND workflow_dispatch both carry ref:refs/heads/<branch>).
data "aws_iam_policy_document" "github_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:ref:refs/heads/${var.github_branch}"]
    }
  }
}

resource "aws_iam_role" "storybook_deploy" {
  name               = "${var.project_name}-deploy"
  description        = "Assumed by GitHub Actions to deploy Storybook to S3 + CloudFront"
  assume_role_policy = data.aws_iam_policy_document.github_trust.json
}

# Least privilege: sync the one bucket, invalidate the one distribution.
data "aws_iam_policy_document" "storybook_deploy" {
  statement {
    sid       = "ListBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.storybook.arn]
  }

  statement {
    sid    = "SyncObjects"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${aws_s3_bucket.storybook.arn}/*"]
  }

  statement {
    sid       = "InvalidateCache"
    effect    = "Allow"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [aws_cloudfront_distribution.storybook.arn]
  }
}

resource "aws_iam_role_policy" "storybook_deploy" {
  name   = "${var.project_name}-deploy"
  role   = aws_iam_role.storybook_deploy.id
  policy = data.aws_iam_policy_document.storybook_deploy.json
}
