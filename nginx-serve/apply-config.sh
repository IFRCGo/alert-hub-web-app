#!/bin/bash -xe

SOURCE_DIRECTORY=${APPLY_CONFIG__SOURCE_DIRECTORY?Required}
DESTINATION_DIRECTORY=${APPLY_CONFIG__DESTINATION_DIRECTORY?Required}

# Parse arguments for --overwrite option
OVERWRITE_DESTINATION=${APPLY_CONFIG__OVERWRITE_DESTINATION:-false}
for arg in "$@"; do
  if [[ "$arg" == "--overwrite" ]]; then
    OVERWRITE_DESTINATION=true
  fi
done


if [ -d "$DESTINATION_DIRECTORY" ]; then
  if [ "$OVERWRITE_DESTINATION" == "true" ]; then
    echo "Destination directory <$DESTINATION_DIRECTORY> already exists. Force deleting..."
    rm -rf "$DESTINATION_DIRECTORY"
  else
    echo "Destination directory <$DESTINATION_DIRECTORY> already exists. Please delete and try again, or use --overwrite to force delete."
    exit 1
  fi
fi

mkdir -p $(dirname "$DESTINATION_DIRECTORY")
cp -r --no-target-directory "$SOURCE_DIRECTORY" "$DESTINATION_DIRECTORY"

find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|\<APP_TITLE_PLACEHOLDER\>|$APP_TITLE|g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|\<APP_ENVIRONMENT_PLACEHOLDER\>|$APP_ENVIRONMENT|g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|\<APP_MAPBOX_ACCESS_TOKEN_PLACEHOLDER\>|$APP_MAPBOX_ACCESS_TOKEN|g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|\<APP_GOOGLE_ANALYTICS_ID_PLACEHOLDER\>|$APP_GOOGLE_ANALYTICS_ID|g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|\<https://APP-GRAPHQL-API-ENDPOINT-PLACEHOLDER.COM/|$APP_GRAPHQL_API_ENDPOINT|g" {} +
find "$DESTINATION_DIRECTORY" -type f -exec sed -i "s|\<APP_HCAPTCHA_SITEKEY_PLACEHOLDER|$APP_HCAPTCHA_SITEKEY|g" {} +


# Show diffs (Useful to debug issues)
set +xe
find "$SOURCE_DIRECTORY" -type f -printf '%P\n' | while IFS= read -r file; do
    diff -W 100 <(fold -w 100 "$SOURCE_DIRECTORY/$file") <(fold -w 100 "$DESTINATION_DIRECTORY/$file") --suppress-common-lines
done
