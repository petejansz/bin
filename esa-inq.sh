#! /bin/sh

HOST=$1
TICKETSN=$2

curl --verbose POST \
  "http://$HOST/api/v2/draw-games/tickets/inquire" \
  -H 'Cache-Control: no-cache'                               \
  -H 'content-type: application/json'                        \
  -H 'X-ESA-API-KEY: z931zsHZ+U6jYXKk6VP4FeHTD1gTbTzS'       \
  -H 'x-originator-id: 10002,1,1,0'                          \
  -H 'x-request-id: 1234567890,0'                              \
  -H 'x-site-id: 35'                                         \
  -d "{\"ticketSerialNumber\": \"${TICKETSN}\"}"
