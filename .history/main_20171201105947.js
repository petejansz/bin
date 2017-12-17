var fs = require( 'fs' )
var util = require( 'util' )
var ibmdb = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/ibm_db' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var path = require( 'path' )

// var playerIds = fs.readFileSync( 'playerids.txt' ).toString('utf-8').split("\n")
var textLines = []
textLines.push('The quick brown fox\n')
textLines.push('jumped over the lazy\n')
textLines.push('dogs and ran away into the woods.')
fs.writeFileSync('quick-brown-fox.txt')
console.log(fs.readFileSync( 'quick-brown-fox.txt' ))