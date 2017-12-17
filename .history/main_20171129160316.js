var fs = require( 'fs' )
var util = require( 'util' )
var ibmdb = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/ibm_db' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var path = require( 'path' )

var playerIds = fs.readFileSync( 'players.csv' ).toString('utf-8').split("\n")
for (i=0; i<playerIds.length; i++)
{
    console.log(playerIds[i])
}