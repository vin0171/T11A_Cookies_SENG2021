#!/bin/bash

# Define the URL for DynamoDB Local
DYNAMO_URL="https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.tar.gz"
DYNAMO_DIR=".dynamodb"

# Check if DynamoDB Local is already downloaded
if [ ! -d "$DYNAMO_DIR" ]; then
  mkdir .dynamodb
  curl -o dynamodb_local_latest.tar.gz $DYNAMO_URL

  tar -xzf dynamodb_local_latest.tar.gz -C .dynamodb
  rm dynamodb_local_latest.tar.gz
  
  echo "DynamoDB Local downloaded and extracted."
else
  echo "DynamoDB Local already exists."
fi
