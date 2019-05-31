#!/bin/sh
# inject_input.sh

set -e

cmd="$@"

sed -e "s/INPUT_GEOMETRY/${INPUT_GEOMETRY}/" -i /usr/share/nginx/html/static/js/*.js*

>&2 echo "Input injected - executing command ${cmd}"
exec ${cmd}
