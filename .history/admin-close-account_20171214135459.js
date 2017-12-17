/*
  NodeJS command-line interface to pd2-admin close-account REST function.
  Author: Pete Jansz, IGT 2017-06-30
*/

var http = require( "http" )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

program
    .version( '0.0.1' )
    .description( 'admin close player account' )
    .usage( 'admin-close-account -h <hostname> -i <playerId>' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-p, --port [port]', 'Port number', parseInt )
    .parse( process.argv )

process.exitCode = 1

if ( !program.playerId || !program.hostname )
{
    program.help()
}

var options =
    {
        "method": "PUT",
        "hostname": program.hostname,
        "port": program.port ? program.port : lib1.adminPort,
        "path": "/california-admin-rest/api/v1/admin/players/" + program.playerId + "/closeaccount",
        "headers":
            {
                "content-type": "application/json",
                "cache-control": "no-cache"
            }
    }

var req = http.request( options, function ( res )
{
    var chunks = []

    res.on( "data", function ( chunk )
    {
        chunks.push( chunk )
    } )

    res.on( "end", function ()
    {
        var body = Buffer.concat( chunks )
        console.log( body.toString() )
        process.exitCode = 1
    } )
} )

req.write( JSON.stringify( { contractId: program.playerId, reason: 'Admin, close this account!' } ) )
req.end()