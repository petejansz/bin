/*
  NodeJS command-line interface to login, return an oauth token.
  Author: Pete Jansz
*/

var http = require( "http" );
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" );
const { exec } = require( 'child_process' );
const { spawn } = require( 'child_process' );
const { spawnSync } = require( 'child_process' );

program
    .version( '0.0.1' )
    .description( 'NodeJS command-line interface to login, return an oauth token.' )
    .usage( 'oauth-login -h <host> -u <username> -p <password>' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-u, --username <username>', 'Username' )
    .option( '-p, --password <password>', 'Password' )
    .parse( process.argv );

var exitValue = 0;

if ( !program.hostname && !program.username || !program.password )
{
    program.help();
    process.exit( 1 );
}

const oauthLogin = spawnSync( 'node', ['pd-oauth-login', '-h', program.hostname, '-u', program.username, '-p', program.password],
    {
        shell: true
    }
);

if ( oauthLogin.status != 0 )
{
    console.log( oauthLogin.stderr.toString() );
    process.exit( 1 );
}

const oauthTokens = spawnSync( 'node', ['oauth-tokens', '-h', program.hostname, '-a', oauthLogin.stdout.toString()],
    {
        shell: true
    }
);

if ( oauthTokens.status != 0 )
{
    console.log( oauthTokens.stderr.toString() );
    process.exit( 1 );
}

console.log( oauthTokens.stdout.toString() );
process.exit( 0 );