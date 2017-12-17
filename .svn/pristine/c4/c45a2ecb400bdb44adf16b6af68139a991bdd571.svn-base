/*
  NodeJS CLI to pd-crm-processess contact-verification REST methods.
  Author: Pete Jansz
*/

var http = require( "http" );
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess contact-verification REST methods' )
    .usage( 'processes-contact-verification.js [option] <args>' )
    .option( '-t, --token [token]', 'One time token' )
    .option( '-j, --jsonfile [jsonfile]', 'JSON file' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .parse( process.argv );

var exitValue = 0;

if ( !program.hostname )
{
    program.help();
    process.exit( 1 );
}

var token = null;

if ( program.jsonfile )
{
    var jsonBody = require( program.jsonfile );
    token = jsonBody.oneTimeToken;
}
else
{
    token = program.token;
}

if ( token.match( /=/ ) )
{
    token = token.split( '=' )[1];
}

var restPath = "/california/api/v1/processes/contact-verification";
var siteID = 35;
var systemId = 8;
var channelId = 2;

var jsonBody =
    {
        "callerChannelId": channelId,
        "callingClientId": "127.0.0.1",
        "callerSystemId": systemId,
        "transactionIdBase": lib1.generateUUID(),
        "transactionTime": new Date().valueOf(),
        "siteID": siteID,
        "oneTimeToken": token
    };

var options =
    {
        "method": "POST",
        "hostname": program.hostname,
        "port": 8180,
        "path": restPath,
        "headers": {
            "x-site-id": siteID,
            "x-channel-id": channelId,
            "x-ex-system-id": systemId,
            "x-client-id": "127.0.0.1",
            "x-unique-id": "V6Cypgr-Um0AAAdzZasdcvbdsd",
            "content-type": "application/json;charset=UTF-8",
            "accept-language": "en-US,en;q=0.8,mt;q=0.6",
            "accept-encoding": "gzip, deflate, br",
            "accept": "application/json, text/javascript, */*; q=0.01",
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
        var responseBodyBuffer = Buffer.concat( chunks );
        var responseBodyStr = responseBodyBuffer.toString();
        var responseBodyJSON = JSON.parse( responseBodyStr );
        var errorEncountered = responseBodyJSON.errorEncountered == true;
        if ( errorEncountered )
        {
            exitValue = 1;
            console.log( 'errorEncountered: ' + errorEncountered
                + ", errorCode: " + responseBodyJSON.errorCode
                + ", transactionIdBase: " + jsonBody.transactionIdBase
            );
        }

        if ( responseBodyJSON.oneTimeToken != null )
        { console.log( responseBodyJSON.oneTimeToken ); }

        process.exit( exitValue );
    } );
} );

req.write( JSON.stringify( jsonBody ) );
req.end();
