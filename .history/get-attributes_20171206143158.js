var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
const fs = require( 'fs' )
var util = require( 'util' )

program
    .version( '0.0.1' )
    .description( 'NodeJS command-line interface to self get attributes' )
    .usage( '-h <host> [-u username -p password]' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-u, --username [username]', 'Username' )
    .option( '-p, --password [password]', 'Password' )
    .parse( process.argv );

process.exitCode = 1

if ( !program.hostname )
{
    program.help()
}

var authCode = null
if ( program.username && program.password )
{
    authCode = getOAuthCode( program.hostname, program.username, program.password )
}
else
{
    var stdinBuffer = fs.readFileSync( 0 ) // STDIN_FILENO = 0
    authCode = stdinBuffer.toString().trim()
}

getAttributes( program.hostname, authCode, process.stdout )
process.exitCode = 0

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

    request( options ).pipe( responseStream )
}

function getOAuthCode( hostname, username, password )
{
    var binPath = process.env.USERPROFILE + '/Documents/bin/'
    const { spawnSync } = require( 'child_process' )

    var creds = ['-u', username, '-p', password]
    const oauthLogin = spawnSync( 'node', [binPath + 'oauth-login', '-h', hostname, creds],
        {
            shell: true
        }
    )

    var authCode = null

    if ( oauthLogin.status != 0 )
    {
        throw new Error( 'OAuth login failed. ' + oauthLogin.stderr.toString() )
    }
    else
    {
        authCode = oauthLogin.stdout.toString().trim()
    }

    return authCode
}