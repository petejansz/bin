/**
 * PDAdmin search for players.
 * Pete Jansz 2017-10-31
 */

var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var pd2admin = require( process.env.USERPROFILE + '/Documents/bin/pd2-admin-lib' )

program
    .version( '0.0.1' )
    .description( 'CLI to pdadmin-rest search for players' )
    .usage( 'ARGS' )
    .option( '--email [email]', 'Email' )
    .option( '--city [City]', 'City' )
    .option( '--firstname [firstname]', 'First name' )
    .option( '--lastname [lastname]', 'Last name' )
    .option( '--host [cat1|cat2|localhost|pdadmin]', 'Hostname' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.host.match(/^cat1$|^cat2$|^localhost$|^pdadmin$/i) )
{
    program.help()
}

var pdAdminSystem = createPdAdminSystem( program )
pd2admin.searchForPlayers( pdAdminSystem, responseHandler )

function createPdAdminSystem( program )
{
    var pdAdminSystem =
        {
            url: null,
            qs: {},
            auth: 'ESMS null'
        }

    if ( program.host === 'cat1' )
    {
        pdAdminSystem.url = 'http://10.164.172.231/california-admin-rest/api/v1/admin/players'
        pdAdminSystem.auth = 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4'
    }
    else if ( program.host === 'cat2' )
    {
        pdAdminSystem.url = 'https://10.164.172.245/california-admin-rest/api/v1/admin/players'
        pdAdminSystem.auth = 'ESMS GRROWP4M5D6NH5IMHX1YBHNIJJEVQ8'
    }
    else if ( program.host === 'localhost' )
    {
        pdAdminSystem.url = 'http://localhost:8380/california-admin-rest/api/v1/admin/players'
    }
    else if ( program.host === 'pdadmin' )
    {
        pdAdminSystem.url = 'http://pdadmin:8280/california-admin-rest/api/v1/admin/players'
    }

    if ( program.email ) { pdAdminSystem.qs.email = program.email }
    if ( program.firstname ) { pdAdminSystem.qs.firstName = ( program.firstname ? program.firstname : null ) }
    if ( program.lastname ) { pdAdminSystem.qs.lastName = ( program.lastname ? program.lastname : null ) }
    if ( program.city ) { pdAdminSystem.qs.city = ( program.city ? program.city : null ) }

    return pdAdminSystem
}

function responseHandler( error, response, body )
{
    if ( error )
    {
        throw new Error( error )
    }

    console.log( body )
    process.exitCode = 0
}