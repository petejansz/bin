/*
  NodeJS command-line interface to pd-crm-processess processes/player-note REST function.
  Author: Pete Jansz
*/

var path = require( 'path' )
const scriptName = path.basename( __filename )
const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )
var processes = require(modulesPath + 'pete-lib/processes-lib')

program
    .version( '0.0.1' )
    .description( 'CLI to pd-crm-processess processes/player-note' )
    .usage( scriptName + ' -h <hostname> -i <playerId>' )
    .option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.hostname || !program.playerId )
{
    program.help()
}

processes.createNote( program.hostname, program.playerId, createNoteResponseHandler, errorHandler )

function createNoteResponseHandler( response )
{
    if ( response.note )
    {
        console.log( response.note.id )
        process.exitCode = 0
    }
    else
    {
        console.error( response )
    }
}

function errorHandler( error )
{
    console.error( error )
}
