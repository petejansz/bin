/*
  NodeJS command-line interface to pd-crm-processess processes/update-player-data REST function.
  Author: Pete Jansz
*/

var fs = require( "fs" );
var path = require( "path" );
var http = require( "http" );
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess processes/update-player-data' )
    .usage( '-h <hostname> -i <playerId> -j <jsonfile>' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-j, --jsonfile <jsonfile>', 'JSON file' )
    .parse( process.argv );

var exitValue = 0;

if ( !program.hostname || !program.jsonfile )
{
    program.help();
    process.exit( 1 );
}

jsonBody = require( path.resolve( program.jsonfile ) );

jsonBody.callingClientId = lib1.getFirstIPv4Address();
jsonBody.transactionIdBase = lib1.generateUUID();
jsonBody.transactionTime = new Date().valueOf();
jsonBody.callerChannelId = lib1.caConstants.channelId;
jsonBody.callerSystemId = lib1.caConstants.systemId;
jsonBody.siteID = lib1.caConstants.siteID;
jsonBody.playerId = program.playerId;
jsonBody.playerUpdate.playerId = program.playerId;

var restPath = "/california/api/v1/processes/update-player-data";

var options =
{
    "method": "POST",
    "hostname": program.hostname,
    "port": lib1.crmProcessesPort,
    "path": restPath,
    "headers": lib1.commonHeaders
};

options.headers['x-player-id'] = program.playerId;

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

        process.exit( exitValue );
    } );
} );

req.write( JSON.stringify( jsonBody ) );
req.end();