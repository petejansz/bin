var fs = require( 'fs' )
var path = require( 'path' )
var util = require( 'util' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )

program
.version( '0.0.1' )
.description( 'CLI to pd-crm-processess processes/update-player-data' )
.usage( '-h <hostname> -i <playerId> -j <jsonfile>' )
.option( '-i, --playerId <playerId>', 'PlayerID', parseInt )
.option( '-h, --hostname <hostname>', 'Hostname' )
.option( '-j, --jsonfile <jsonfile>', 'JSON file' )
.parse( process.argv )

var obj = require( path.resolve( program.jsonfile ) )
obj.value.id[0]

