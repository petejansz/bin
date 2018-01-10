var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )
const fs = require( 'fs' )

const STDIN_FILENO = 0
var stdinBuffer = fs.readFileSync( STDIN_FILENO ).toString().trim()
var o = JSON.parse( stdinBuffer )
console.log( JSON.stringify( o, null, 4 ) )