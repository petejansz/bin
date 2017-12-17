var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var path = require( 'path' )
var util = require( 'util' )
const { spawnSync } = require( 'child_process' )

program
    .version( '0.0.1' )
    .description( 'NodeJS command-line interface to self get attributes' )
    .usage( '-h <host> -u <username> -p <password>' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-u, --username <username>', 'Username' )
    .option( '-p, --password <password>', 'Password' )
    .parse( process.argv );

process.exitCode = 0

if ( !program.hostname && !program.username || !program.password )
{
    program.help()
}

var binPath = process.env.USERPROFILE + '/Documents/bin/'

const oauthLogin = spawnSync( 'node', [binPath + 'oauth-login', '-h', program.hostname, '-u', program.username, '-p', program.password],
    {
        shell: true
    }
)

if ( oauthLogin.status != 0 )
{
    console.log( oauthLogin.stderr.toString() )
    process.exit( 1 )
}

var options =
{
    method: "GET",
    hostname: program.hostname,
//    "port": null,
    path: "/api/v1/players/self/attributes",
    headers: lib1.commonHeaders
}

options.headers.authorization = "OAuth " + oauthLogin.stdout.toString().trim()

request( options, function ( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    console.log( body )
} )
