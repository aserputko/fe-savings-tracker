# PRODUCTION — https://savings-tracker-webapp.aserputko.com
#
# Apply with:
#   terraform workspace select production || terraform workspace new production
#   terraform apply -var-file=production.tfvars
#
# Only `environment` is required; every other value is derived from it (see
# locals.tf) or falls back to the shared defaults in variables.tf. Override any
# default here if this environment needs to differ.
environment = "production"
