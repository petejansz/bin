var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
const path = require( 'path' )
const fs = require( 'fs' )
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

process.exitCode = 1

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

var authCode = null

if ( oauthLogin.status != 0 )
{
    console.log( 'OAuth login failed. ' + oauthLogin.stderr.toString() )
    process.exit()
}
else
{
    authCode = oauthLogin.stdout.toString().trim()
    var attributes = fs.createWriteStream('./attributes.json')
    getAttributes( program.hostname, authCode, attributes )
    fs.createReadStream('./attributes.json').pipe(process.stdout)
    // var stats = fs.statSync('./attributes.json')
    console.log(stats.size)
    process.exitCode = 0
}

function getAttributes( hostname, authCode, responseStream )
{
    var urlFormat = 'http://%s/api/v1/players/self/attributes'
    var url = util.format( urlFormat, hostname )

    var options =
        {
            method: 'GET',
            url: url,
            headers: lib1.commonHeaders
        }

    options.headers.authorization = "OAuth " + authCode

    request( options, function ( error, response, body )
    {
        if ( error )
        {
            throw new Error( error )
        }

        responseStream.write( body )
    } )
}