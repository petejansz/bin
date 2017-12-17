var fs = require( "fs" )
var zlib = require( 'zlib' )

/*
    Java convert String to (ByteArray) InputStream:
        InputStream is = new ByteArrayInputStream( str.getBytes(Charset.forName("UTF-8")) )
*/

/*
    Java convert String to OutputStream:
    OutputStream os = new FileOutputStream('/home/pete/output.txt')
    os.write(str.getBytes(Charset.forName("UTF-8")));
*/

//capitalize( process.stdin, process.stdout )

// Copy stdin to stdout:
process.stdin.pipe(process.stdout)

function capitalize( inStream, outStream )
{
    inStream.on( 'data', function ( data )
    {
        var transformedString = data.toString().toUpperCase()
        outStream.write( Buffer.from(transformedString) );
    } )
}

function convertStringToInputStream(str)
{

}

// Compress the file input.txt to input.txt.gz
var inputTextFilename = './validation.properties'
var gzipFilename = './input.txt.gz'

// cat textFilename | gzip gzipFilename:
//fs.createReadStream(inputTextFilename).pipe(zlib.createGzip()).pipe(fs.createWriteStream(gzipFilename))

// gunzip gzipFilename # contents written to stdout:
// read gzip file into GunZip object, pipe contents to stdout:
//fs.createReadStream( gzipFilename ).pipe( zlib.createGunzip() ).pipe( process.stdout )
