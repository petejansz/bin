/*
  NodeJS CLI to pd2-admin get enums, get playerId from username.
  Author: Pete Jansz
*/

var path = require( 'path' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var str_to_stream = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/string-to-stream' )
var pd2admin = require( process.env.USERPROFILE + '/Documents/bin/pd2-admin-lib' )

program
    .version( '0.0.1' )
    .description( 'NodeJS CLI to pd2-admin get enums, get playerId from username' )
    .usage( ' ARGS ' )
    .option( '--host [hostname]', 'Hostname' )
    .option( '--port [port]', 'Port number', parseInt )
    .option( '--enums', 'Get enums' )
    .option( '-u, --username [username]', 'Username' )
    .parse( process.argv )

process.exitCode = 1

if ( program.enums )
{
    pd2admin.getAdminEnums( adminEnumsResponseHandler )
}
else if ( program.username && program.host )
{
    pd2admin.getPlayerId( program.username, program.host, program.port, getPlayerIdResponseHandler, errorHandler )
}
else
{
    program.help()
}

function getPlayerIdResponseHandler( response )
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

function adminEnumsResponseHandler( response )
{
    if ( response.statusCode == 200 )
    {
        console.log( response.body.toString() )
        process.exitCode = 0
    }
    else
    {
        console.error( response.statusCode + ", " + response.statusMessage )
    }
}

