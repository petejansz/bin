/*
  NodeJS command-line interface to get an oauth token from the oauth/self/tokens REST API.
  Author: Pete Jansz
*/

var http = require( "http" )
const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )
var lib1 = require( modulesPath + 'pete-lib/pete-util' )

program
    .version( '0.0.1' )
    .description( 'NodeJS command-line interface to get an oauth token from the oauth/self/tokens REST API.' )
    .usage( 'oauth-tokens -h <hostname> -a <authcode>' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-a, --authcode <authcode>', 'authcode' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.hostname || !program.authcode )
{
    program.help()
    process.exit()
}

var siteID = 35;
var systemId = 8;
var channelId = 2;

var jsonRequestBody =
    {
        authCode: program.authcode,
        clientId: 'SolSet2ndChancePortal',
        siteId: siteID
    };

var options = {
    "method": "POST",
    "hostname": program.hostname,
    "port": null,
    "path": "/api/v1/oauth/self/tokens",
    "headers": {
        "content-type": "application/json",
        "x-ex-system-id": systemId,
        "x-channel-id": channelId,
        "x-site-id": siteID,
        "cache-control": "no-cache",
    }
}

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
            var responseBodyBuffer = Buffer.concat( chunks )
            var responseBodyJSON = JSON.parse( responseBodyBuffer.toString() )
            console.log( responseBodyJSON[1].token )
            process.exitCode = 0
            process.exit()
        }
        else
        {
            console.error( this.statusCode + ": " + this.statusMessage )
            process.exit( )
        }
    } )
} )

req.write( JSON.stringify( jsonRequestBody ) )
req.end()