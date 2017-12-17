var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var str_to_stream = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/string-to-stream' )
var pd2admin = require( process.env.USERPROFILE + '/Documents/bin/pd2-admin-lib' )

program
    .version( '0.0.1' )
    .description( 'CLI to pdadmin-rest create note' )
    .usage( 'ARGS' )
    .option( '--playerid [playerid]', 'PlayerId', parseInt )
    .option( '--port [port]', 'Port number', parseInt )
    .option( '--host <hostname>', 'Hostname' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.host )
{
    program.help()
}

var port = program.port ? program.port : lib1.adminPort
pd2admin.createNote( program.host, port, program.playerid, noteResponseHandler )

function noteResponseHandler( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    str_to_stream( JSON.stringify( body ) ).pipe( process.stdout )
    process.exitCode = 0
}
