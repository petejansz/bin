var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var path = require( 'path' )
var util = require( 'util' )
var scriptName = path.basename( __filename )

var options = { method: 'POST',
  url: 'http://10.164.172.231/california-admin-rest/api/v1/admin/players/1000001998/note',
  headers:
   { 'postman-token': '55f3a4cc-6b36-56ae-44a7-ce1b73046393',
     'cache-control': 'no-cache',
     cookie: 'JSESSIONIDSSO=rKbRth4xBdJwmu5NL7O5joG9',
     'accept-language': 'en-US,en;q=0.8,fr;q=0.6',
     'accept-encoding': 'gzip, deflate',
     referer: 'http://10.164.172.231/admin-ui/admin.html?token=791BZZZXBA6OECKRKV9Z8DW3YCT0W5',
     dnt: '1',
     'content-type': 'application/json',
     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
     authorization: 'ESMS 791BZZZXBA6OECKRKV9Z8DW3YCT0W5',
     'x-requested-with': 'XMLHttpRequest',
     origin: 'http://10.164.172.231',
     accept: 'application/json, text/javascript, */*; q=0.01' },
  body:
   { displayAlert: false,
     note: 'adsfasdf',
     user: 'administrator',
     creationDate: 1510560000000 },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
