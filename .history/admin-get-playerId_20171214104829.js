/*
  NodeJS command-line interface to admin/players get playerId from username.
  Author: Pete Jansz
*/

var path = require( 'path' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var str_to_stream = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/string-to-stream' )
var pd2admin = require(process.env.USERPROFILE + '/Documents/bin/pd2-admin-lib')

program
    .version( '0.0.1' )
    .description( 'admin get player Id' )
    .usage( ' -h <hostname> -u <username>' )
    .option( '-u, --username <username>', 'Username' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-p, --port [port]', 'Port number', parseInt )
    .parse( process.argv )

process.exitCode = 1

if ( !program.username || !program.hostname )
{
    program.help()
}

pd2admin.getPlayerId( program.username, program.hostname, program.port, responseHandler, errorHandler )

function responseHandler( response )
{
    if ( response.length && response[0].playerId )
    {
        var playerId = response[0].playerId
        str_to_stream( playerId ).pipe( process.stdout )
        process.exitCode = 0
    }
    else
    {
        console.error( 'Username not found: ' + username )
    }
}

function errorHandler( error )
{
    console.error( error )
}
