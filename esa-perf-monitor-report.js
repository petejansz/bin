#!/usr/bin/env node

/**
 * ESA monitor log file processor. Parse infile, produce JSON, CSV to stdout, file.
 * Author: Pete Jansz
*/

var fs = require( 'fs' )
var util = require( 'util' )
var program = require( 'commander' )
var peteUtil = require( 'pete-lib/pete-util' )

program
    .version( '1.0.0' )
    .description( 'ESA monitor log file processor' )
    .usage( 'options' )
    .option( '--infile [infile]', 'Input filename' )
    .option( '--outcsv [outcsv]', 'Output csv filename' )
    .option( '--outhtml [outhtml]', 'Output html filename' )
    .option( '--outjson [outjson]', 'Output outjson filename' )
    .option( '--stdout', 'Write JSON or selected out file type to stdout' )
    .option( '--sort-asc <key>', 'Sort ascending by key' )
    .option( '--sort-desc <key>', 'Sort descending by key' )

    .parse( process.argv )

var monitors = []
process.exitCode = 1
var wroteToStdout = false

if ( !program.infile )
{
    program.help()
}

var logdata = fs.readFileSync( program.infile ).toString()
monitors = processData( logdata )

if ( program.sortAsc )
{
    monitors = monitors.sort( peteUtil.compareValues( program.sortAsc, 'asc' ) )
}
else if ( program.sortDesc )
{
    monitors = monitors.sort( peteUtil.compareValues( program.sortDesc, 'desc' ) )
}

if ( program.outjson )
{
    var formattedOutput = JSON.stringify( monitors, null, 4 )

    if ( program.stdout && !wroteToStdout )
    {
        console.log( formattedOutput )
        wroteToStdout = true
    }

    fs.writeFileSync( program.outjson, formattedOutput )
}

if ( program.outcsv )
{
    var formattedOutput = toCsv()

    if ( program.stdout && !wroteToStdout )
    {
        console.log( formattedOutput )
        wroteToStdout = true
    }

    fs.writeFileSync( program.outcsv, formattedOutput )
}

if ( program.outhtml )
{
    var formattedOutput = toHtml()

    if ( program.stdout && !wroteToStdout )
    {
        console.log( formattedOutput )
        wroteToStdout = true
    }

    fs.writeFileSync( program.outhtml, formattedOutput )
}

process.exitCode = 0

/////// local functions ///////////////////////////////////////////////

function processData( logdata )
{
    var monitors = []
    var csvSamples = logdata.trim().split( '\n' )

    for ( var i = 0; i < csvSamples.length; i++ )
    {
        var csvSample = csvSamples[i].trim()
        monitors.push( createMonitor( csvSample ) )
    }

    return monitors
}

function createMonitor( monitorFileLine )
{
    var tokens = monitorFileLine.trim().split( ' ' )
    var monitor = {}
    var index = 0

    monitor.isoUTCTimestamp = tokens[index++] + ' ' + tokens[index++]
    var isoUTCDate = new Date( monitor.isoUTCTimestamp )
    monitor.localDateTimeString = convertUTCToLocalDateTimeString( isoUTCDate )

    monitor.avgResponseTimeMs = convertToMs( tokens[index++].split( ':' )[1] )
    monitor.maxResponseTimeMs = convertToMs( tokens[index++].split( ':' )[1] )
    monitor.minResponseTimeMs = convertToMs( tokens[index++].split( ':' )[1] )
    monitor.requests = Number( tokens[index++].split( ':' )[1].replace( /\D/g, '' ) )
    monitor.responses = Number( tokens[index++].split( ':' )[1].replace( /\D/g, '' ) )
    monitor.errors = Number( tokens[index++].split( ':' )[1].replace( /\D/g, '' ) )
    monitor.maxcon = Number( tokens[index++].split( ':' )[1].replace( /\D/g, '' ) )
    monitor._99thMs = convertToMs( tokens[index++].split( ':' )[1] )
    monitor._95thMs = convertToMs( tokens[index++].split( ':' )[1] )
    monitor._90thMs = convertToMs( tokens[index++].split( ':' )[1] )
    monitor._75thMs = convertToMs( tokens[index++].split( ':' )[1] )
    monitor._50thMs = convertToMs( tokens[index++].split( ':' )[1] )
    monitor.heapPct = Number( tokens[index++].split( ':' )[1].replace( /%/g, '' ) )
    monitor.load = tokens[index++].split( ':' )[1]
    monitor.cpuPct = Number( tokens[index++].split( ':' )[1].replace( /%/g, '' ) )

    return monitor
}

function convertToMs( seconds )
{
    var ms
    var multiplier = multiplier

    if ( seconds.match( /ms/ ) )
    {
        ms = seconds.replace( /[a-z]*/g, '' )
    }
    else if ( seconds.match( /us/ ) )
    {
        multiplier = 1000000
        us = seconds.replace( /[a-z]*/g, '' )
        ms = us * multiplier
    }
    else
    {
        multiplier = 1000
        s = seconds.replace( /[a-z]*/g, '' )
        ms = s * multiplier
    }

    return Number( ms )
}

function toCsv()
{
    var formattedOutput = Object.keys( monitors[0] ).join( ',' ) + '\n'

    for ( var i = 0; i < monitors.length; i++ )
    {
        var csvLine = convertMonitorToCsv( monitors[i] ) + '\n'
        formattedOutput += csvLine
    }

    return formattedOutput
}

function convertMonitorToCsv( monitor )
{
    const format = "%s,".repeat( Object.keys( monitor ).length - 1 )
    var csvString = util.format
        ( format.replace( /,$/g, '' ),
        monitor.localDateTimeString,
        monitor.isoUTCTimestamp,
        monitor.avgResponseTimeMs,
        monitor.maxResponseTimeMs,
        monitor.minResponseTimeMs,
        monitor.requests,
        monitor.responses,
        monitor.errors,
        monitor.maxcon,
        monitor._99thMs,
        monitor._95thMs,
        monitor._90thMs,
        monitor._75thMs,
        monitor._50thMs,
        monitor.heapPct,
        monitor.load,
        monitor.cpuPct
        )

    return csvString
}

function toHtml()
{
    let html = '<html>\n  <header>\n  </header>\n'
    html += '  <body>\n    <table border="1">\n'
    html += '                <tr><th colspan="24"></th></tr>\n'
    html += tableHeaders() + '\n'

    for ( var i = 0; i < monitors.length; i++ )
    {
        var monitor = monitors[i]
        var tableRow = createTableRow( monitor, 'td' )
        html += tableRow
    }

    html += '\n</body>\n</table>\n</html>'

    return html
}

function tableHeaders()
{
    var headerNames = Object.keys( monitors[0] )
    var s = '<tr>\n'
    for ( var i = 0; i < headerNames.length; i++ )
    {
        s += createTableItem( headerNames[i], 'th' )
    }

    s += '</tr>\n'
    return s
}

function createTableRow( monitor )
{
    var values = Object.values( monitor )
    var s = '<tr>\n'
    for ( var i = 0; i < values.length; i++ )
    {
        s += createTableItem( values[i], 'td' )
    }

    s += '</tr>\n'
    return s
}

function createTableItem( item, t )
{
    return '<' + t + '>' + item + '</' + t + '>\n'
}

/**
 * Return Date formatted string with abbreviated timezone name, e.g., "2018-8-15 21:00:00 PDT"
 * @param {Date} utcDate
 */
function convertUTCToLocalDateTimeString( utcDate )
{
    // Extract timezone and convert to abbreviated, e.g., "PDT"
    var tzName = utcDate.toTimeString().split( '(' )[1].replace( ')', '' ).replace( /\W|\d|[a-z]/g, '' )
    return utcDate.toLocaleString() + ' ' + tzName
}
