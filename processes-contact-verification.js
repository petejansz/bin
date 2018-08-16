/*
  NodeJS CLI to pd-crm-processess contact-verification REST methods.
  Author: Pete Jansz
*/

const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )
var lib1 = require( modulesPath + 'pete-lib/pete-util' )
var http = require( "http" )
var path = require( 'path' )
var scriptName = path.basename( __filename )

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess contact-verification REST methods' )
    .usage( '[option] <args>' )
    .option( '-i, --playerId [playerId]', 'PlayerId' )
    .option( '-o, --oldpassword [oldpassword]', 'Old password' )
    .option( '-n, --newpassword [newpassword]', 'New password' )
    .option( '-c, --change', 'Change password' )
    .option( '-r, --reset', 'Reset password' )
    .option( '-v, --verify', 'Verify contact' )
    .option( '-t, --token [token]', 'One time token' )
    .option( '-j, --jsonfile [jsonfile]', 'JSON file' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.hostname )
{
    program.help()
}

var token = null

if ( program.jsonfile )
{
    var jsonBody = require( program.jsonfile )
    token = jsonBody.oneTimeToken
}
else if (program.token)
{
    token = program.token;
    if ( token.match( /=/ ) )
    {
        token = token.split( '=' )[1]
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
    program.help()
}

var jsonBody =
    {
        "callerChannelId": lib1.caConstants.channelId,
        "callingClientId": lib1.getFirstIPv4Address(),
        "callerSystemId": lib1.caConstants.systemId,
        "transactionIdBase": lib1.generateUUID(),
        "transactionTime": new Date().valueOf(),
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
        }


// console.log(JSON.stringify(jsonBody))

var req = http.request( options, function ( res )
{
    var chunks = []

    res.on( "data", function ( chunk )
    {
        chunks.push( chunk )
    } );

    res.on( "end", function ()
    {
        var responseBodyBuffer = Buffer.concat( chunks )
        var responseBodyStr = responseBodyBuffer.toString()
        var responseBodyJSON = JSON.parse( responseBodyStr )
        var errorEncountered = responseBodyJSON.errorEncountered == true
        if ( errorEncountered )
        {
            console.log( 'errorEncountered: ' + errorEncountered
                + ", errorCode: " + responseBodyJSON.errorCode
                + ", transactionIdBase: " + jsonBody.transactionIdBase
            )
        }

        if ( responseBodyJSON.oneTimeToken != null )
        {
            console.log( responseBodyJSON.oneTimeToken )
        }

        process.exitCode = 1
        process.exit()
    } )
} )

req.write( JSON.stringify( jsonBody ) )
req.end()
