// Pete Jansz
// Generate SQL update script file for

const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )
var csvParser = require( modulesPath + 'csv-parse/lib/sync' )
var fs = require( 'fs' )
var util = require( 'util' )
var path = require( 'path' )

program
    .version( '0.0.1' )
    .description( 'Generate SQL script' )
    .usage( ' ARGS' )
    .option( '--csvfile <csvfile>', 'CSV file of player IDs' )
    .option( '--sqlt <sqlt>', 'SQL template file' )
    .option( '--from <from>', '' )
    .option( '--to <to>', '' )
    .option( '--of [outputfile]', 'Write SQL to output file' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.csvfile || !program.sqlt )
{
    program.help()
}

var playerIdList = fs.readFileSync( program.csvfile ).toString().trim().split( '\n' )
var sqlt = fs.readFileSync( program.sqlt ).toString().trim()

generateSql( playerIdList, sqlt )
process.exitCode = 0
///////////////////////////////////////////////////////////////////////////////

function generateSql( playerIdList, sqlt )
{
    // console.log( util.format( "-- Generated: %s", new Date() ) )
    // console.log( "-- " + sqlt.description + "\n" )

    for ( i = (program.from - 1); i < playerIdList.length; i++ )
    {
        if (i > program.to) {break}

        var playerId = playerIdList[i].trim()

        if ( isNaN( playerId ) )
        {
            continue
        }

        var sqlCode = sqlt
        sqlCode = sqlCode.replace( /\?/g, playerId ) + "\n\ncommit;\n"

        //console.log( i+1 + ' / ' + playerIdList.length )
        fs.writeFileSync( playerId + '.sql', sqlCode )
    }
}

