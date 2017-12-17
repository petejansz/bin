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
    .option( '-r, --proto [http|https]', 'Protocol' )
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
// var firstName = encodeURI(program.firstname ? program.firstname : null)
// var lastName = encodeURI(program.lastname ? program.lastname : null)
var qs = {}
if (program.email) qs.email = program.email
if (program.firstname) qs.firstName = program.firstname
if (program.lastname)  qs.lastName = program.lastname

const devAuth = 'ESMS null'
const cat1Auth = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'
const cat2Auth = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'
var auth = devAuth

if (proto === 'https')
{
    qs._ = '1511797015071'
    auth = cat1Auth
}
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
