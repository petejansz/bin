var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var path = require( 'path' )
var util = require( 'util' )
var scriptName = path.basename( __filename )

var options = {
    method: 'POST',
    url: 'http://10.164.172.231/california-admin-rest/api/v1/admin/players/1000001998/note',
    headers:
        {
            'cache-control': 'no-cache',
            referer: 'http://10.164.172.231/admin-ui/admin.html?token=791BZZZXBA6OECKRKV9Z8DW3YCT0W5',
            dnt: '1',
            'content-type': 'application/json',
            authorization: 'ESMS 791BZZZXBA6OECKRKV9Z8DW3YCT0W5',
            origin: 'http://10.164.172.231',
            accept: 'application/json, text/javascript, */*; q=0.01'
        },
    body:
        {
            displayAlert: false,
            note: new Date().getTime(),
            user: 'administrator'
        },
    json: true
};

request( options, function ( error, response, body )
{
    if ( error ) throw new Error( error );

    console.log( body );
} );
