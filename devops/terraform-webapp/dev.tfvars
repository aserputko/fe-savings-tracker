# DEV — https://savings-tracker-webapp-dev.aserputko.com
#
# Apply with:
#   terraform workspace select dev || terraform workspace new dev
#   terraform apply -var-file=dev.tfvars
#
# Only `environment` is required; every other value is derived from it (see
# locals.tf) or falls back to the shared defaults in variables.tf. Override any
# default here if this environment needs to differ.
environment = "dev"
