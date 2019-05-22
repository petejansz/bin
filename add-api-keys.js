// https://www.npmjs.com/package/xml2js

var fs = require( "fs" )
var util = require( 'util' )
var program = require( 'commander' )
var xml2js = require( 'xml2js' )

program
    .version( '0.0.1' )
    .description( 'Add new api-keys to config file' )
    .usage( ' ARGS' )
    .option( '--configfile <configfile>', 'XML config file' )
    .option( '--keyfile <keyfile>', 'Key file' )
    .option( '--stdout', 'Write XML to stdout' )
    .option( '--update', 'Update/overwrite configfile' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.configfile || !program.keyfile )
{
    program.help()
    process.exit()
}

var keys = [] = require( 'fs' ).readFileSync( program.keyfile, 'utf-8' ).split( '\n' ).filter( Boolean )

fs.readFile( program.configfile, 'utf-8', function ( err, xmlData )
{
    xml2js.parseString( xmlData, function ( err, resultObj )
    {
        if ( err ) console.log( err )
        var json = resultObj

        for ( var i = 0; i < keys.length; i++ )
        {
            var apiKey = createApikey( keys[i], ( i + 1 ) )
            json.config.applications[0].mobile[0].apikeys[0].apikey.push( apiKey )
        }

        // create a new builder object, convert our json obj to xml:
        var builder = new xml2js.Builder()
        var xml = builder.buildObject( json )
        if ( program.stdout )
        {
            console.log( xml )
        }

        if ( program.update )
        {
            fs.writeFile( program.configfile, xml, function ( err, data )
            {
                if ( err )
                {
                    process.exitCode = 1
                    console.error( err )
                }
                else
                {
                    console.log( 'Updated: ' + program.configfile )
                    process.exitCode = 0
                }
            } )
        }
    } )
} )

function createApikey( key, index )
{
    var now = new Date()
    var keyText = util.format( 'Android or iOS App %s-%s-%s %s',
        now.getFullYear(), now.getMonth() + 1, now.getDate(), index )
    var apiKey = { "key": keyText, "signaturekey": key.trim() }
    return apiKey
}
