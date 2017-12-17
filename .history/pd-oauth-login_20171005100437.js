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

function responseHandler( response )
{
    if ( response.statusCode == 200 )
    {
        var responseBodyJSON = JSON.parse( response.body.toString() );
        console.log( responseBodyJSON[0].authCode );
        process.exit( 0 );
    }
    else
    {
        console.error( response.statusCode + ", " + response.statusMessage );
        process.exit( 1 );
    }
}

function getLoginToken( hostname, username, password, responseHandler )
{
    var jsonRequestBody =
        {
            siteId: lib1.caConstants.siteID,
            clientId: 'SolSet2ndChancePortal',
            resourceOwnerCredentials: { USERNAME: username, PASSWORD: password }
        };

    var options =
        {
            "method": "POST",
            "hostname": hostname,
            "path": "/api/v1/oauth/login",
            "headers": lib1.commonHeaders
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
            var body = Buffer.concat( chunks );
            var responseObj =
                {
                    headers: this.headers,
                    statusCode: this.statusCode,
                    statusMessage: this.statusMessage,
                    body: body
                };
            responseHandler( responseObj );
        } );
    } );

    req.write( JSON.stringify( jsonRequestBody ) );
    req.end();
}


getLoginToken( program.hostname, program.username, program.password, responseHandler );