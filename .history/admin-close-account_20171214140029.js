/*
  NodeJS command-line interface to pd2-admin close-account REST function.
  Author: Pete Jansz, IGT 2017-06-30
*/

var http = require( "http" )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )

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
        method: "PUT",
        rejectUnauthorized: false,
        url: pdAdminSystem.url + '/' + playerId + '/closeaccount',
        headers:
            {
                'cache-control': 'no-cache',
                referer: lib1.getFirstIPv4Address(),
                dnt: '1',
                Authorization: pdAdminSystem.auth,
            },
        body:
            {
                contractId: program.playerId, reason: 'Admin, close this account!'
            },
        json: true
    }

request( options, responseHandler )