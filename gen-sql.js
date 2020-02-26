#!/usr/bin/env node

// Pete Jansz
// Generate SQL update script file for

var program = require( 'commander' )
var csvParser = require( 'csv-parse/lib/sync' )
var fs = require( 'fs' )
var util = require( 'util' )
var path = require( 'path' )

program
    .version( '0.0.1' )
    .description( 'Generate SQL script' )
    .usage( ' ARGS' )
    .option( '--csvfile <csvfile>', 'CSV file of player IDs' )
    .option( '--sqlt <sqlt>', 'SQL template file' )
    // .option( '--from <from>', '' )
    // .option( '--to <to>', '' )
    // .option( '--of [outputfile]', 'Write SQL to output file' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.csvfile || !program.sqlt )
{
    program.help()
}

var csvData = fs.readFileSync( program.csvfile ).toString().trim().split( '\n' )
var sqlt = fs.readFileSync( program.sqlt ).toString().trim()

generateSql( csvData, sqlt )
process.exitCode = 0
///////////////////////////////////////////////////////////////////////////////

function generateSql( csvData, sqlt )
{
    fs.writeFileSync( program.of, util.format( '-- Generated: %s\n', new Date() ) )

    for ( var i=0; i < csvData.length; i++ )
    {
        var obj = {}
        var tokens = csvData[i].replace( /\"/g, '' ).trim().split( ',' )
        obj.playerId = tokens[0]
        obj.eventTypeName = tokens[1]
        var sqlCode = sqlt
        sqlCode = sqlCode.replace( /\{ExtContactKey\}/, obj.playerId ).replace( /\{EventTypeName\}/, obj.eventTypeName )
        sqlCode += '\n'
        console.log( util.format( '%s - %s', obj.playerId, obj.eventTypeName ) )
        fs.appendFileSync( program.of, sqlCode )
    }
}

