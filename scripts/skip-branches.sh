#!/bin/bash

# Skip CI/CD of vercel for temp branches

if [ "$VERCEL_GIT_COMMIT_REF" != "main" ] && [ "$VERCEL_GIT_COMMIT_REF" != "develop" ]; then
  echo "Skipping build for branch $VERCEL_GIT_COMMIT_REF"
  exit 0
else
  exit 1
fi
