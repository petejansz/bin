/**
 * pd2-admin-rest get, update players personal-info, profile
 * Pete Jansz
 */

var fs = require( "fs" );
var path = require( "path" );
var http = require( "http" );
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );

program
    .version( '0.0.1' )
    .description( 'pd2-admin-rest get, update players personal-info or profile' )
    .usage( 'admin-players-profile -h <hostname> -i <playerId>' )
    .option( '-m, --method < per | pro >', 'Method personalInfo | profile' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-p, --port [port]', 'Port number', parseInt )
    .option( '-j, --jsonfile [jsonfile]', 'JSON Body Filename' )
    .parse( process.argv );

var exitValue = 0;

if ( !program.playerId || !program.hostname ||!program.method)
{
    program.help();
    process.exit( 1 );
}

var adminRestInterface = null;

if ( program.method.toString().match( /per/ ) )
{
    adminRestInterface = "/personal-info";
}
else if ( program.method.toString().match( /pro/ ) )
{
    adminRestInterface = "/profile";
}
else
{
    program.help();
    process.exit( 1 );
}

var method = "GET";
var jsonBody = null;

if ( program.jsonfile )
{
    jsonBody = require( path.resolve( program.jsonfile ) );
    method = "PUT";
}

var options =
{
    "method": method,
    "hostname": program.hostname,
    "port": program.port ? program.port : lib1.adminPort,
    "path": "/california-admin-rest/api/v1/admin/players/" + program.playerId + adminRestInterface,
    "headers": lib1.adminHeaders
};

options.headers.authorization = "ESMS 6JCYV4DO0H7O7BA3OSPAHU0OND4PN0";

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
        console.log( body.toString() );
    } );
} );

if ( program.jsonfile )
{
    req.write( JSON.stringify( jsonBody ) );
}

req.end();