/**
 * PDAdmin search for players.
 * Pete Jansz 2017-10-31
 */

var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );
var path = require( 'path' )
var scriptName = path.basename( __filename )

program
    .version( '0.0.1' )
    .description( 'CLI to pdadmin-rest search for players' )
    .usage( scriptName + ' -h <hostname> ARGS' )
    .option( '-e, --email [email]', 'Email' )
    .option( '-f, --firstname [firstname]', 'First name' )
    .option( '-l, --lastname [lastname]', 'Last name' )
    .option( '-p, --port [port]', 'Port number', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .parse( process.argv );

var exitValue = 0;

if ( !program.hostname )
{
    program.help()
    process.exit( 1 )
}

var port = program.port ? program.port : lib1.adminPort
var proto = program.proto ? program.proto : 'http'
var qs = {}
if (program.email) qs.email = program.email
if (program.firstname) qs.firstName = program.firstname
if (program.lastname)  qs.lastName = program.lastname

var auth = 'ESMS null'
var hostname = null

if (program.hostname === 'cat1')
{
    hostname = '10.164.172.231'
    port = 80
    proto = 'https'
    qs._ = '1511797015071'
    auth = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'
}
else if (program.hostname === 'cat2')
{
    hostname = '10.164.172.245'
    port = 80
    proto = 'https'
    qs._ = '1511305891634'
    auth = 'ESMS GRROWP4M5D6NH5IMHX1YBHNIJJEVQ8'
}
// var firstName = encodeURI(program.firstname ? program.firstname : null)
// var lastName = encodeURI(program.lastname ? program.lastname : null)

var url = proto + '://' + hostname + ':' + port + '/california-admin-rest/api/v1/admin/players'
console.log(url)
var options =
{
    method: 'GET',
    rejectUnauthorized: false,
    url: url,
    qs: qs,
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
