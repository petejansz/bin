var fs = require( "fs" )
var zlib = require( 'zlib' )
var str_to_stream = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/string-to-stream' )

/*  NOTES
    Java convert String to (ByteArray) InputStream:
        InputStream is = new ByteArrayInputStream( str.getBytes(Charset.forName("UTF-8")) )

    Java convert String to OutputStream:
        OutputStream os = new FileOutputStream('/home/pete/output.txt')
        os.write(str.getBytes(Charset.forName("UTF-8")));

    NodeJS Convert String to OutputStream:
        outStream.write( Buffer.from( str ) )

    Copy stdin to stdout:
        process.stdin.pipe( process.stdout )

    Chaining, piping:
    WriteStream ws = new Foo(options)
    instr.pipe(new Foo(options)).pipe(os)
*/

var is = convertStringToInputStream( 'Goodbye, cruel world.' )
capitalize( is, process.stdout )


function capitalize( inStream, outStream )
{
    inStream.on( 'data', function ( data )
    {
        var transformedString = data.toString().toUpperCase()
        outStream.write( Buffer.from( transformedString ) );
    } )
}

function convertStringToInputStream( str )
{
    return str_to_stream( str )
}

// Compress the file input.txt to input.txt.gz
var inputTextFilename = './validation.properties'
var gzipFilename = './input.txt.gz'

// cat textFilename | gzip gzipFilename:
// var gzip = zlib.createGzip()
// var fs = require( 'fs' )
// var inp = fs.createReadStream( inputTextFilename )
// var out = fs.createWriteStream( gzipFilename )
// inp.pipe( gzip ).pipe( out )

// or
// fs.createReadStream(inputTextFilename).pipe(zlib.createGzip()).pipe(fs.createWriteStream(gzipFilename))

// gunzip gzipFilename # contents written to stdout:
// read gzip file into GunZip object, pipe contents to stdout:
//fs.createReadStream( gzipFilename ).pipe( zlib.createGunzip() ).pipe( process.stdout )
