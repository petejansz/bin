
var path = require( 'path' )
var util = require( 'util' )
var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var str_to_stream = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/string-to-stream' )
var stream_to_str = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/stream-to-string' )
var lib1 = require( process.env.USERPROFILE + '/Documents/bin/lib1.js' )
var SITES = {OR: 11}

var description = ''

program
    .version( '0.0.1' )
    //    .description( description )
    .usage( 'ARGS' )
    .option( '--host [hostname]', 'Hostname' )
    .option( '--port [port]', 'Port number', parseInt )
    .option( '--instant', 'Default is draw' )
    .option( '--ticket [ticket]', 'ticket s/n' )
    .option( '--originator [originator]', 'x-originator-id (7)' )
    .option( '--siteid [siteid]', 'x-site-id (Oregon 11)' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.ticket && !program.host )
{
    program.help()
}

var port = program.port ? program.port : 8580
var games = program.instant ? 'instant-games' : 'draw-games'
var options = {
    method: 'POST',
    url: "http://" + program.host + ":" + port + "/api/v1/" + games + "/tickets/inquire",
    headers:
        {
            'cache-control': 'no-cache',
            'x-request-id': '123123',
            'x-originator-id': program.originator ? program.originator : 7,
            'x-site-id': program.siteid ? program.siteid : SITES.OR,
            'content-type': 'application/json'
        },
    json: true
}

if (program.instant)
{
    var barcode = program.ticket.replace(/ |\-/g, '')
    options.body = { barcode: barcode }
}
else
{
    options.body = { ticketSerialNumber: program.ticket }
}

request( options, function ( error, response, body )
{
    if ( error ) throw new Error( error )

    process.exitCode = 0
    console.log( JSON.stringify( body ) )
} )
