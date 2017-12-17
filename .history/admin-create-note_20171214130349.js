var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var str_to_stream = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/string-to-stream' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var util = require( 'util' )

program
    .version( '0.0.1' )
    .description( 'CLI to pdadmin-rest create note' )
    .usage( 'ARGS' )
    .option( '--playerid [playerid]', 'PlayerId', parseInt )
    .option( '--port [port]', 'Port number', parseInt )
    .option( '--host <hostname>', 'Hostname' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.host )
{
    program.help()
}

var port = program.port ? program.port : lib1.adminPort
createNote( program.host, port, program.playerid, noteResponseHandler )

function createNote( hostname, port, playerId, noteResponseHandler )
{
    var urlFormat = 'http://%s:%s/california-admin-rest/api/v1/admin/players/%s/note'
    var url = util.format( urlFormat, hostname, port, playerId )
    var options =
        {
            method: 'POST',
            url: url,
            headers: lib1.adminHeaders,
            referer: lib1.getFirstIPv4Address(),
            dnt: '1',
            body:
                {
                    displayAlert: false,
                    note: 'Make a note.',
                    user: 'administrator',
                    creationDate: new Date().getTime()
                },
            json: true
        }

    options.headers.authorization = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'

    request( options, noteResponseHandler )
}

function noteResponseHandler( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    str_to_stream( body ).pipe( process.stdout )
    process.exitCode = 0
}
