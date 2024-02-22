#!/bin/bash

ACCOUNT=$(aws sts get-caller-identity --output text --query Account)
REGION=$(aws configure get region)

if [ -n "${1}" ]; then
  echo "profile: ${1}"
  export AWS_PROFILE=${1}
fi

if [ "$AWS_PROFILE" = "" ]; then
  echo "No AWS_PROFILE set"
  exit 1
fi

npx cdk bootstrap \
    --profile $AWS_PROFILE \
    --no-bootstrap-customer-key \
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
    aws://$ACCOUNT/$REGION