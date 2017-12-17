var fs = require( "fs" )
var zlib = require( 'zlib' )

var myWrStream = fs.createWriteStream
capitalize( process.stdin, process.stdout )

function capitalize( inStream, outStream )
{
    inStream.on( 'data', function ( data )
    {
        var transformedString = data.toString().toUpperCase()
        outStream.write( Buffer.from(transformedString) );
    } )
}

// Compress the file input.txt to input.txt.gz
var inputTextFilename = './validation.properties'
var gzipFilename = './input.txt.gz'

// cat textFilename | gzip gzipFilename:
//fs.createReadStream(inputTextFilename).pipe(zlib.createGzip()).pipe(fs.createWriteStream(gzipFilename))

// gunzip gzipFilename # contents written to stdout:
// read gzip file into GunZip object, pipe contents to stdout:
//fs.createReadStream( gzipFilename ).pipe( zlib.createGunzip() ).pipe( process.stdout )
