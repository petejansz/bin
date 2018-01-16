// Pete Jansz
// Generate SQL update script file for

const DESCRIPTION = 'CASA-11033: KBOX Ticket 108593 - Write Script for 2nd Chance Player accounts to un-verify (out of state addresses)'
var fs = require( 'fs' )
var util = require( 'util' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var csvParser = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv/node_modules/csv-parse/lib/sync' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var path = require( 'path' )

program
    .version( '0.0.1' )
    .description( "Generate SQL update script file\n" + DESCRIPTION )
    .usage( ' ARGS' )
    .option( '--csvfile <csvfile>', 'CSV file of player IDs' )
    .option( '--sqlt <sqlt>', 'SQL template file' )
    .option( '--pid', 'Print playerIDs' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.csvfile || !program.sqlt )
{
    process.exit()
}

var data = fs.readFileSync( program.csvfile )
var records = csvParser( data, { columns: true } )
var sqlt = require( path.resolve( program.sqlt ) )

var playerIdList = []

for ( var i = 0; i < records.length; i++ )
{
    var record = records[i]
    var playerID = record.playerID
    if (program.pid)
    {
        console.log(playerID)
    }

    playerIdList.push( playerID )
}

if (program.pid)
{
    process.exitCode = 0
    process.exit()
}

generateSql( playerIdList, sqlt.statements )
process.exitCode = 0
///////////////////////////////////////////////////////////////////////////////

function generateSql( playerIdList, statments )
{
    console.log( util.format( "-- Generated: %s", new Date() ) )
    console.log( "-- " + DESCRIPTION + "\n" )

    var sqlStatementTemplate = statments.join( "\n\n" )

    for ( i = 0; i < playerIdList.length; i++ )
    {
        var playerId = playerIdList[i].trim()
        if ( isNaN( playerId ) )
        {
            continue
        }

        var sqlCode = sqlStatementTemplate
        sqlCode = sqlCode.replace( /\?/g, playerId ) + "\n\ncommit;\n"

        console.log( sqlCode )
    }
}

