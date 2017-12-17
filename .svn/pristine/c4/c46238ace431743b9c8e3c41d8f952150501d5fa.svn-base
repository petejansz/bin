/*
  NodeJS CLI to pd-crm-processess contact-verification REST methods.
  Author: Pete Jansz
*/

var http = require( "http" );
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );
var path = require( 'path' );
var scriptName = path.basename( __filename );

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess contact-verification REST methods' )
    .usage( scriptName + ' [option] <args>' )
    .option( '-i, --playerId [playerId]', 'PlayerId' )
    .option( '-o, --oldpassword [oldpassword]', 'Old password' )
    .option( '-n, --newpassword [newpassword]', 'New password' )
    .option( '-c, --change', 'Change password' )
    .option( '-r, --reset', 'Reset password' )
    .option( '-v, --verify', 'Verify contact' )
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
else if (program.token)
{
    token = program.token;
    if ( token.match( /=/ ) )
    {
        token = token.split( '=' )[1];
    }
}

var restPath = "/california/api/v1/processes/"

if ( program.reset )
{
    restPath += "password-reset"
}
else if ( program.verify )
{
    restPath += "contact-verification"
}
else if ( program.change )
{
    restPath += "password-change"
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
        // "oneTimeToken": token,
        "oldPassword": program.oldpassword,
        "newPassword": program.newpassword,
        "playerId": program.playerId
    },
    options =
        {
            "method": "POST",
            "hostname": program.hostname,
            "port": lib1.crmProcessesPort,
            "path": restPath,
            "headers": lib1.commonHeaders
        };


// console.log(JSON.stringify(jsonBody))

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
