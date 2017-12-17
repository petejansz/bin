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

function getPlayerId( username, host, port, responseHandler, errorHandler )
{
    var util = require( 'util' )
    var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request-promise' )
    var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
    const restPath = '/california-admin-rest/api/v1/admin/players'
    const uri = util.format( '%s://%s:%s%s', 'http', host, ( port ? port : lib1.adminPort ), restPath )
    var options =
        {
            uri: uri,
            qs: { email: encodeURI( username ) },
            headers: lib1.adminHeaders,
            json: true
        }

    request( options )
        .then( function ( resp )
        {
            responseHandler( resp )
        } )
        .catch( function ( err )
        {
            errorHandler( err )
        } )
}

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
