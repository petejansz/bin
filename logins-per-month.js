
var fs = require( 'fs' )
var path = require( 'path' )
var util = require( 'util' )
const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )
var csvParser = require( modulesPath + 'csv-parse/lib/sync' )
var lib1 = require( modulesPath + 'pete-lib/pete-util' )

program
    .version( '0.0.1' )
    .description( 'Report the number of logins per month from CSV file with LAST_LOGIN_DATE, e.g., 2017-12-31' )
    .usage( 'options' )
    .option( '-c, --csvfile [csvfile]', 'csvfile' )
    .parse( process.argv )

var exitValue = 0

var calendarMonthsMap = new Map()
var monthNum = 1;
["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].forEach( function ( name )
{
    calendarMonthsMap.set( monthNum, name );
    monthNum++;
} )

function mkYearMonthKey( year, monthName )
{
    return year + ":" + monthName
}

function uniqYears( records )
{
    var years = []
    for ( var i = 0; i < records.length; i++ )
    {
        var lastLoginDate = records[i].LAST_LOGIN_DATE
        var lastLoginYear = lastLoginDate.split( '-' )[0]
        years.push( lastLoginYear )
    }

    return lib1.sortUniq( years )
}

// Read input CSV file, parse, initialize arrays, map objects:
var data = null

if ( program.csvfile )
{
    data = fs.readFileSync( program.csvfile )
}
else
{
    var stdinBuffer = fs.readFileSync( 0 ) // STDIN_FILENO = 0
    data = stdinBuffer.toString().trim()
}

var records = csvParser( data, { columns: true } )
var years = uniqYears( records )
var yearMonthMap = new Map()

function initYearMonthMap()
{
    years.forEach( function ( year )
    {
        for ( var monthName of calendarMonthsMap.values() )
        {
            var key = mkYearMonthKey( year, monthName )
            var monthMap = new Map()
            monthMap.set( monthName, 0 )
            yearMonthMap.set( key, monthMap )
        }
    }, this );
}

// Process records for the numbers:
function buildStatistics( records )
{
    var somethingToReport = false

    for ( var i = 0; i < records.length; i++ )
    {
        var record = records[i]
        var lastLoginDate = record.LAST_LOGIN_DATE
        var lastLoginYear = lastLoginDate.split( '-' )[0]
        var monthNum = parseInt( lastLoginDate.split( '-' )[1] )
        var monthName = calendarMonthsMap.get( monthNum )
        var key = mkYearMonthKey( lastLoginYear, monthName )
        var itsMonthMap = yearMonthMap.get( key )

        if ( itsMonthMap != null )
        {
            somethingToReport = true
            var count = itsMonthMap.get( monthName )
            itsMonthMap.set( monthName, count + 1 )
            yearMonthMap.set( key, itsMonthMap )
        }
    }

    return somethingToReport
}

function produceReport( somethingToReport )
{
    if ( somethingToReport )
    {
        var formatStr = '%s,%s,%s'
        console.log( util.format( formatStr, 'YEAR', 'MONTH', 'LOGIN_COUNT' ) )

        years.forEach( function ( year )
        {
            for ( var monthName of calendarMonthsMap.values() )
            {
                var key = mkYearMonthKey( year, monthName )
                var itsMonthMap = yearMonthMap.get( key )
                var loginCount = itsMonthMap.get( monthName )

                if ( loginCount )
                {
                    console.log( util.format( formatStr, year, monthName, loginCount ) )
                }
            }
        } );
    }
}

initYearMonthMap()
produceReport( buildStatistics( records ) )