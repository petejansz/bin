/*
  NodeJS command-line interface to login with the /api/v1/oauth/login REST API and get the authCode.
  Author: Pete Jansz
*/

var http = require( "http" );
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );

program
    .version( '0.0.1' )
    .description( 'NodeJS command-line interface to login with the /api/v1/oauth/login REST API and get the authCode.' )
    .usage( 'pd-oauth-login -h <hostname> -u <username> -p <password>' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-u, --username <username>', 'username' )
    .option( '-p, --password <password>', 'password' )
    .parse( process.argv );

var exitValue = 0;

if ( !program.hostname || !program.username || !program.password )
{
    program.help();
    process.exit( 1 );
}

var siteID = 35;
var systemId = 8;
var channelId = 2;

var jsonRequestBody =
    {
        siteId: siteID,
        clientId: 'SolSet2ndChancePortal',
        resourceOwnerCredentials: { USERNAME: program.username, PASSWORD: program.password }
    };

var options =
    {
        "method": "POST",
        "hostname": program.hostname,
        "port": null,
        "path": "/api/v1/oauth/login",
        "headers": {
            "content-type": "application/json",
            "x-ex-system-id": systemId,
            "x-channel-id": channelId,
            "x-site-id": siteID,
            "cache-control": "no-cache",
        }
    };

var req = http.request( options, function ( res )
{
    var chunks = [];

    res.on( "data", function ( chunk )
    {
        chunks.push( chunk );
    } );

    res.on( "end", function ()
    {
        if ( this.statusCode == 200 )
        {
            var responseBodyBuffer = Buffer.concat( chunks );
            var responseBodyJSON = JSON.parse( responseBodyBuffer.toString() );
            console.log( responseBodyJSON[0].authCode );
            process.exit( exitValue );
        }
        else
        {
            console.error( this.statusCode + ": " + this.statusMessage );
            exitValue = 1;
            process.exit( exitValue );
        }
    } );
} );

req.write( JSON.stringify( jsonRequestBody ) );
req.end();