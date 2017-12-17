/*
  NodeJS command-line interface to pd-crm-processess update-notification-preferences REST function.
  Author: Pete Jansz
*/

var http = require( "http" );
var program = require(process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander');
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );

program
    .version('0.0.1')
    //.usage('[options] <file ...>')
    .option('-i, --playerId <playerId>', 'PlayerID', parseInt)
    .option('-h, --hostname <hostname>', 'Hostname')
    .option('-j, --jsonBodyFilename <jsonBodyFilename>', 'JSON Body Filename')
    .parse(process.argv);

var jsonBodyFilename = myArgs[2];

var exitValue = 0;

if ( playerId == null || hostname == null || jsonBodyFilename == null )
{
    console.log( "USAGE: node processes-update-notification-preferences.js -h <hostname> -i <playerId> -j <jsonBodyFilename>" );
    process.exit( 1 );
}

var jsonBody = require( jsonBodyFilename );
var siteID = 35;
var systemId = 8;
var channelId = 2;

jsonBody.callerChannelId = channelId;
jsonBody.callingClientId = "127.0.0.1";
jsonBody.callerSystemId = systemId;
jsonBody.transactionIdBase = lib1.generateUUID();
jsonBody.transactionTime = new Date().valueOf();
jsonBody.siteID = siteID;
jsonBody.playerId = playerId;

var options = {
    "method": "POST",
    "hostname": hostname,
    "port": 8180,
    "path": "/california/api/v1/processes/update-notification-preferences-list",
    "headers": {
        "accept": "application/json",
        "x-player-id": playerId,
        "x-channel-id": channelId,
        "x-client-id": "127.0.0.1",
        "x-ex-system-id": systemId,
        "x-tx-id": jsonBody.transactionIdBase,
        "x-tx-time": jsonBody.transactionTime,
        "x-site-id": siteID,
        "content-type": "application/json;charset=UTF-8",
        "content-length": 14770,
        "host": "127.0.0.1",
        "connection": "Keep-Alive"
    }
};

options.playerId = playerId;

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
        var errorEncountered = responseBodyJSON.fieldErrors != null;
        if ( errorEncountered )
        {
            exitValue = 1;
            console.log( responseBodyStr );
        }

        process.exit( exitValue );
    } );
} );

req.write( JSON.stringify( jsonBody ) );
req.end();