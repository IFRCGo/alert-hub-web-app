#!/bin/env bash

set -xe

# Substitute WEB_APP_SERVE_PLACEHOLDER__<VAR> markers with runtime values.
# Based on the base image's default-app-apply-config.sh (which handles ^APP_),
# but hardened: sed replacement metacharacters are escaped so URLs/tokens with
# \, & or the | delimiter substitute literally.
while IFS='=' read -r KEY VALUE; do
    # Escape sed replacement metacharacters (\, & and the | delimiter) so
    # URLs/tokens containing them substitute literally
    ESCAPED_VALUE=$(printf '%s' "$VALUE" | sed -e 's/[\\&|]/\\&/g')
    find "$DESTINATION_DIRECTORY" -type f \
        -exec sed -i "s|\<WEB_APP_SERVE_PLACEHOLDER__$KEY\>|$ESCAPED_VALUE|g" {} +
done < <(env | grep '^APP_')

# Resolve unfilled placeholders to real JS `undefined` (falsy) instead of
# leaking the literal marker (a truthy string) into the bundle. The
# overrideDefineForWebAppServe emits the marker JSON-stringified (quoted), so
# consuming the surrounding quotes turns `"WEB_APP_SERVE_PLACEHOLDER__APP_X"`
# into a bare `undefined`. Warn about every placeholder still unfilled — this
# also surfaces unquoted occurrences the rewrite intentionally leaves in place
# (e.g. a user-visible index.html <title> marker, covered by a baked default in
# the Dockerfile final stage), so an accidentally-unset var is loud, not silent.
LEFTOVER_PLACEHOLDERS=$(grep -rho 'WEB_APP_SERVE_PLACEHOLDER__APP_[A-Za-z0-9_]*' "$DESTINATION_DIRECTORY" | sort -u)
if [ -n "$LEFTOVER_PLACEHOLDERS" ]; then
    echo "WARNING: the following placeholders had no runtime value and were replaced with 'undefined':" >&2
    printf '%s\n' "$LEFTOVER_PLACEHOLDERS" | sed 's/^/  - /' >&2
fi
find "$DESTINATION_DIRECTORY" -type f \
    -exec sed -i 's|"WEB_APP_SERVE_PLACEHOLDER__APP_[A-Za-z0-9_]*"|undefined|g' {} +
