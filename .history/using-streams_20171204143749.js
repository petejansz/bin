var fs = require( "fs" )

var data = fs.readFileSync('./validation.properties' )
// Create a writable stream
var writerStream = fs.createWriteStream( 'output.txt' )

// Pipe the read and write operations
// read input.txt and write data to output.txt
readerStream.pipe( process.stdout )

console.log( "Program Ended" )