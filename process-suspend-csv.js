var fs = require( 'fs' )
var path = require( 'path' )
var util = require( 'util' )
var csv = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv-parser' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )

program
    .version( '0.0.1' )
    .description( 'Suspend player SQL generator' )
    .usage( ' ARGS' )
    .option( '--csvfile [csvfile]', 'CSV file or stdin of CONTRACT_IDENTITY,CONTRACT_ID,EMAIL_VERIFIED,SERVICE_TYPE_IDS,SERVICE_STATUS_IDS' )
    .option( '--sqlt [sqlt]', 'SQL template file' )
    .option( '--of [outputfile]', 'Write SQL to output file' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.sqlt )
{
    program.help()
    // process.exit()
}

var inputStream

if ( program.csvfile )
{
    inputStream = fs.createReadStream( program.csvfile )
}
else
{
    inputStream = process.stdin
}
const PREACTIVE = 1
const ACTIVE = 2
const SUSPEND = 3

console.log( '%s %s %s %s %s', 'CONTRACT_IDENTITY', 'CONTRACT_ID', 'EMAIL_VERIFIED', 'Portal_Service_Status', 'SC__Status' )
inputStream
    .pipe( csv() )
    .on( 'data', function ( data )
    {
        var player = convertCsvRecordToPlayer( data )
        player.newState = 'NOT_SET'

        if ( player.portalService == SUSPEND )
        { player.newState = 'SUSPEND' }
        if ( player.emailVerified && player.portalService == PREACTIVE )
        { player.newState = 'SUSPEND' }
        if ( player.emailVerified && player.secondChanceService == SUSPEND )
        { player.newState = 'SUSPEND' }

        var outputStr =
            player.contractIdentity.padStart( 17 )
            + player.contractId.padStart( 12 )
            + player.emailVerified.padStart( 12 )
            + player.portalService.toString().padStart( 12 )
            + player.secondChanceService.toString().padStart( 12 )
            + player.newState.toString().padStart(12)
        console.log( outputStr )
    } )

function convertCsvRecordToPlayer(csvRecord)
{
    var player =
        {
            contractIdentity: csvRecord.CONTRACT_IDENTITY.trim(),
            contractId: csvRecord.CONTRACT_ID.trim(),
            emailVerified: csvRecord.EMAIL_VERIFIED.trim(),
            portalService: 0,
            secondChanceService: 0,
        }

    if ( csvRecord.SERVICE_STATUS_IDS.includes( ',' ) )
    {
        player.portalService = csvRecord.SERVICE_STATUS_IDS.split( ',' )[0].trim()
        player.secondChanceService = csvRecord.SERVICE_STATUS_IDS.split( ',' )[1].trim()
    }

    return player
}