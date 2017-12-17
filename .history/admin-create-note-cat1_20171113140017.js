var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var path = require( 'path' )
var util = require( 'util' )
var scriptName = path.basename( __filename )

var options = {
    method: 'POST',
    url: 'http://pdadmin/california-admin-rest/api/v1/admin/players/1000004997/note',
    headers:
        {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: 'ESMS 791BZZZXBA6OECKRKV9Z8DW3YCT0W5',
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
