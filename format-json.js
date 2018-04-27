#! /usr/bin/env node

// Format JSON from stdin

var inputStream = process.stdin, data = ''

process.stdin.resume()

// Read the entire input stream into the data variable.
inputStream.on( 'data', function ( chunk )
{
    data += chunk
} )

// At end of stream, load the JSON object and process it.
inputStream.on( 'end', function ()
{
    console.log( JSON.stringify( JSON.parse( data ), null, 4 ) )
} )