var http = require( "http" );
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );

program
    .version( '0.0.1' )
    .description( 'admin get player Id' )
    .usage( 'admin-get-playerId -h <hostname> -u <username>' )
    .option( '-u, --username <username>', 'Username' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-p, --port [port]', 'Port number', parseInt )
    .parse( process.argv );

var exitValue = 0;

if ( !program.username || !program.hostname )
{
    program.help();
    process.exit( 1 );
}

var options =
{
    "method": "GET",
    "hostname": program.hostname,
    "port": program.port ? program.port : lib1.adminPort,
    "path": "/california-admin-rest/api/v1/admin/players?email=" + encodeURI( program.username ),
    "headers": lib1.adminHeaders
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

        if ( responseBodyJSON.length &&  responseBodyJSON[0].playerId != null )
        {
            console.log( responseBodyJSON[0].playerId );
        }
        else
        {
            exitValue = 1;
            console.log( 'Player not found.' );
        }

        process.exit( exitValue );
    } );
} );

req.end();