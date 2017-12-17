/*
  NodeJS command-line interface to pd-crm-processess processes/player-note REST function.
  Author: Pete Jansz
*/

var path = require( 'path' )
const scriptName = path.basename( __filename )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var processes = require(process.env.USERPROFILE + '/Documents/bin/processes-lib')

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

processes.createNote( program.hostname, program.playerId )
