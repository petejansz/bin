#!/usr/bin/sh -x

HOST=$1
USERNAME=$2
OLD_PASSWORD=$3
NEW_PASSWORD=$4

PROTO_HOST="http://${HOST}" #http://cadev1.gtech.com
OAUTH_TOKEN=$(node ~/Documents/bin/pd-login.js -h $HOST -u $USERNAME -p $OLD_PASSWORD)
echo $OAUTH_TOKEN
exit
curl -X PUT \
  "${PROTO_HOST}/api/v2/players/self/password" \
  -H "authorization: OAuth ${OAUTH_TOKEN}" \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'x-channel-id: 2' \
  -H 'x-ex-system-id: 8' \
  -H 'x-site-id: 35' \
  -d "{ \"oldPassword\": \"${OLD_PASSWORD}\",  \"newPassword\": \"${NEW_PASSWORD}\" }"