# STAGING — https://savings-tracker-webapp-stg.aserputko.com
#
# Apply with:
#   terraform workspace select staging || terraform workspace new staging
#   terraform apply -var-file=staging.tfvars
#
# Only `environment` is required; every other value is derived from it (see
# locals.tf) or falls back to the shared defaults in variables.tf. Override any
# default here if this environment needs to differ.
environment = "staging"
