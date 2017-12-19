/*
  NodeJS command-line interface to pd-crm-processess activate, close account REST methods.
  Author: Pete Jansz
*/

var http = require( "http" )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var path = require( 'path' )

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess activate, close account REST methods' )
    .usage( ' -<activate|close> -i <playerId> -h <hostname>' )
    .option( '-a, --activate', 'Activate account' )
    .option( '-c, --close', 'Close account' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .parse( process.argv )

var exitValue = 0

if ( !program.playerId || !program.hostname )
{
    program.help()
    process.exit( 1 )
}

var restPath = "/california/api/v1/processes/"

if ( program.activate )
{
    restPath += "account-activation"
}
else if ( program.close )
{
    restPath += "close-account"
}
else
{
    program.help();
    process.exit( 1 );
}

var transactionTime = new Date().valueOf();
var jsonBody =
    {
        "callerChannelId": lib1.caConstants.channelId,
        "callingClientId": lib1.getFirstIPv4Address(),
        "callerSystemId": lib1.caConstants.systemId,
        "transactionIdBase": lib1.generateUUID(),
        "transactionTime": transactionTime,
        "siteID": lib1.caConstants.siteID,
    }

if (program.close)
{
    jsonBody.playerId = program.playerId
    jsonBody.reason = path.basename( __filename ) + ": transactionTime: " + transactionTime
}
else if (program.activate)
{
    jsonBody.token = program.playerId
}

var options =
{
    "method": "POST",
    "hostname": program.hostname,
    "port": lib1.crmProcessesPort,
    "path": restPath,
    "headers": lib1.commonHeaders
}

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

        if ( responseBodyJSON.oneTimeToken != null )
        { console.log( responseBodyJSON.oneTimeToken ); }

        process.exit( exitValue )
    } );
} );

req.write( JSON.stringify( jsonBody ) )
req.end()
