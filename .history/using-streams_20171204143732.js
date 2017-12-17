var fs = require( "fs" )

var data = fs.readFileSync('./validation.properties' )

// Create a writable stream
var writerStream = fs.createWriteStream( 'output.txt' )
fs.writerStream(data)

console.log( "Program Ended" )