/*
  NodeJS command-line interface to login, return an oauth token.
  Author: Pete Jansz
*/

var http = require( "http" )
const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )
var lib1 = require( modulesPath + 'pete-lib/pete-util' )
const { spawnSync } = require( 'child_process' )

program
    .version( '0.0.1' )
    .description( 'NodeJS command-line interface to login, return an oauth token.' )
    .usage( 'oauth-login -h <host> -u <username> -p <password>' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-u, --username <username>', 'Username' )
    .option( '-p, --password <password>', 'Password' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.hostname && !program.username || !program.password )
{
    program.help()
    process.exit()
}

var binPath = process.env.USERPROFILE + '/Documents/bin/';

const oauthLogin = spawnSync( 'node', [binPath + 'pd-oauth-login.js', '-h', program.hostname, '-u', program.username, '-p', program.password],
    {
        shell: true
    }
);

if ( oauthLogin.status != 0 )
{
    console.log( oauthLogin.stderr.toString() )
    process.exit()
}

const oauthTokens = spawnSync( 'node', [binPath + 'oauth-tokens.js', '-h', program.hostname, '-a', oauthLogin.stdout.toString().trim()],
    {
        shell: true
    }
);

if ( oauthTokens.status != 0 )
{
    console.log( oauthTokens.stderr.toString() )
    process.exit()
}

console.log( oauthTokens.stdout.toString().trim() )
process.exitCode = 0
