/**
 * ESA monitor log file processor. Parse infile, produce JSON, CSV to stdout, file.
 * Author: Pete Jansz
*/

var fs = require( 'fs' )
var util = require( 'util' )
const modulesPath = '/usr/share/node_modules/'
var program = require( modulesPath + 'commander' )

program
    .version( '1.0.0' )
    .description( 'ESA monitor log file processor' )
    .usage( 'options' )
    .option( '--infile [infile]', 'Input filename' )
    .option( '--outcsv [outcsv]', 'Output csv filename' )
    .option( '--outhtml [outhtml]', 'Output html filename' )
    .option( '--outjson [outjson]', 'Output outjson filename' )
    .option( '--stdout', 'Write JSON or selected out file type to stdout' )

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
/////////////////////////////////////////////////////////////////////////////////////

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

    monitor.avgResponseTimeNs = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor.maxResponseTimeNs = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor.minResponseTimeNs = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor.requests = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor.responses = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor.errors = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor.maxcon = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor._99thNs = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor._95thNs = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor._90thNs = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor._75thNs = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor._50thNs = tokens[index++].split( ':' )[1].replace( /\D/g, '' )
    monitor.heapPct = tokens[index++].split( ':' )[1].replace( /%/g, '' )
    monitor.load = tokens[index++].split( ':' )[1]
    monitor.cpuPct = tokens[index++].split( ':' )[1].replace( /%/g, '' )

    return monitor
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
        monitor.avgResponseTimeNs,
        monitor.maxResponseTimeNs,
        monitor.minResponseTimeNs,
        monitor.requests,
        monitor.responses,
        monitor.errors,
        monitor._99thNs,
        monitor._95thNs,
        monitor._90thNs,
        monitor._75thNs,
        monitor._50thNs,
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
