var util = require( 'util' )
var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request-promise' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var path = require( 'path' )
const scriptName = path.basename( __filename )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )

program
    .version( '0.0.1' )
    .description( 'admin get player Id' )
    .usage( scriptName + ' -h <hostname> -u <username>' )
    .option( '-u, --username <username>', 'Username' )
    .option( '-h, --hostname <hostname>', 'Hostname' )
    .option( '-p, --port [port]', 'Port number', parseInt )
    .parse( process.argv )

var exitValue = 0

if ( !program.username || !program.hostname )
{
    program.help()
    process.exit( 1 )
}

getPlayerId( program.username, program.hostname, program.port )

function getPlayerId( username, host, port )
{
    const restPath = '/california-admin-rest/api/v1/admin/players'
    const uri = util.format( '%s://%s:%s%s', 'http', host, ( port ? port : lib1.adminPort ), restPath )
    var options =
        {
            uri: uri,
            qs: { email: encodeURI( username ) },
            headers: lib1.adminHeaders,
            json: true
        }

    console.log(uri)
    function processResponse( response )
    {
        console.log( response )
    }

    function errorHandler( error )
    {
        console.log( error )
    }

    request( options )
        .then( function ( resp )
        {
            processResponse( resp )
        } )
        .catch( function ( err )
        {
            errorHandler( err )
        } )

}