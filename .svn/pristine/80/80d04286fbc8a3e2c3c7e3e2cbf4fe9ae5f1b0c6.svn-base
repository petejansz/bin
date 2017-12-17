/**
 * pd2-admin-rest get, update players personal-info, profile
 * Pete Jansz
 */

var fs = require( "fs" )
var path = require( "path" )
var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

program
    .version( '0.0.1' )
    .description( 'pd2-admin-rest get, update players personal-info or profile' )
    .usage( '-h <hostname> -i <playerId>' )
    .option( '-m, --method < per | pro >', 'Method personalInfo | profile' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname [cat1|cat2|localhost|pdadmin]', 'Hostname' )
    .option( '-p, --port [port]', 'Port number', parseInt )
    .option( '-j, --jsonfile [jsonfile]', 'JSON Body Filename' )
    .parse( process.argv )

var exitValue = 0

if ( !program.playerId || !program.hostname ||!program.method)
{
    program.help()
    process.exit( 1 )
}

var adminRestInterface = null

if ( program.method.toString().match( /per/ ) )
{
    adminRestInterface = "/personal-info"
}
else if ( program.method.toString().match( /pro/ ) )
{
    adminRestInterface = "/profile"
}
else
{
    program.help()
    process.exit( 1 )
}

var method = "GET"
var jsonBody = null

if ( program.jsonfile )
{
    jsonBody = require( path.resolve( program.jsonfile ) )
    method = "PUT"
}

url = "http://10.164.172.231/california-admin-rest/api/v1/admin/players/" + program.playerId + adminRestInterface
//qs._ = '1511797015071'
auth = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'

var options =
{
    method: 'GET',
//    rejectUnauthorized: false,
    url: url,
//    qs: qs,
    headers:
    {
        'cache-control': 'no-cache',
        referer:  lib1.getFirstIPv4Address(),
        dnt: '1',
        Authorization: auth,
    }
}

request( options, function ( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    console.log( body )
} )
