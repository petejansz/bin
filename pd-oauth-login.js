/*
  NodeJS command-line interface to login with the /api/v1/oauth/login REST API and get the authCode.
  Author: Pete Jansz
*/

var http = require( "http" )
const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )
var lib1 = require( modulesPath + 'pete-lib/pete-util' )

program
    .version( '0.0.1' )
    .description( 'NodeJS command-line interface to login with the /api/v1/oauth/login REST API and get the authCode.' )
    .usage( 'pd-oauth-login -h <hostname> -u <username> -p <password>' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-u, --username <username>', 'username' )
    .option( '-p, --password <password>', 'password' )
    .parse( process.argv );

process.exitCode = 1

if ( !program.hostname || !program.username || !program.password )
{
    program.help()
    process.exit()
}

function responseHandler( response )
{
    if ( response.statusCode == 200 )
    {
        var responseBodyJSON = JSON.parse( response.body.toString() )
        console.log( responseBodyJSON[0].authCode )
        process.exitCode = 0
        process.exit()
    }
    else
    {
        console.error( response.statusCode + ", " + response.statusMessage )
        process.exit()
    }
}

function getLoginAuthCode( hostname, jsonRequestBody, responseHandler )
{
    var options =
        {
            "method": "POST",
            "hostname": hostname,
            "path": "/api/v1/oauth/login",
            "headers": lib1.commonHeaders
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
            var body = Buffer.concat( chunks )
            var responseObj =
                {
                    headers: this.headers,
                    statusCode: this.statusCode,
                    statusMessage: this.statusMessage,
                    body: body
                };
            responseHandler( responseObj )
        } );
    } );

    req.write( JSON.stringify( jsonRequestBody ) )
    req.end()
}

var jsonRequestBody =
{
    siteId: lib1.caConstants.siteID,
    clientId: 'SolSet2ndChancePortal',
    resourceOwnerCredentials: { USERNAME: program.username, PASSWORD: program.password }
};

getLoginAuthCode( program.hostname, jsonRequestBody, responseHandler )
