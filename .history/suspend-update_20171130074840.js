// Pete Jansz, Nov 2017

var fs = require( 'fs' )
var util = require( 'util' )
var ibmdb = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/ibm_db' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var path = require( 'path' )

program
    .version( '0.0.1' )
    .description( 'CASA-10729 - suspend, update players' )
    .usage( ' ARGS' )
    .option( '-f, --playerIdFile [file]', 'Filename of player IDs' )
    .option( '-h, --hostname [hostname]', 'DB2 host' )
    .option( '-p, --port [port]', 'DB2 port number (default=55000)', parseInt )
    .option( '-u, --username [username]', 'DB2 username' )
    .option( '-P, --password [password]', 'Password' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.playerIdFile )
{
    program.help()
}

var playerIdList = fs.readFileSync( program.playerIdFile ).toString( 'utf-8' ).split( "\n" )

// Default connection values:
var dbname = "GMS4"
var hostname = '156.24.32.127'
var uid = 'b2cinst1'
var pwd = 'b2cinst1'
var port = 55000

if ( program.hostname ) { hostname = program.hostname }
if ( program.port ) { port = program.port }
if ( program.dbname ) { dbname = program.dbname }
if ( program.username ) { uid = program.username }
if ( program.password ) { pwd = program.password }

var dsn = util.format( "DRIVER={DB2};DATABASE=%s;HOSTNAME=%s;UID=%s;PWD=%s;PORT=%s;PROTOCOL=TCPIP", dbname, hostname, uid, pwd, port )

var startTime = new Date()
console.error( util.format( "Connecting to: %s://%s:%s", hostname, dbname, port ) )

var updateCustomerContacts = "update gms4.sms_customer_contacts\n"
updateCustomerContacts += "  set status = 0, last_updated = current timestamp\n"
updateCustomerContacts += "  where contract_id = (select contract_id from gms4.sms_contracts where contract_identity = ? )"

var updateCustomerServices = "update gms4.sms_customer_services\n"
updateCustomerServices += "  set service_status_id = 3, last_updated = current timestamp\n"
updateCustomerServices += "  where contract_id = (select contract_id from gms4.sms_contracts where contract_identity = ? )\n"
updateCustomerServices += "    and SERVICE_TYPE_ID in (1, 500)"

var updateCustomerProfileData = "update gms4.sms_customer_profile_data\n"
updateCustomerProfileData += "  set value = '0', last_updated = current timestamp\n"
updateCustomerProfileData += "  where contract_id = (select contract_id from gms4.sms_contracts where contract_identity = ?)\n"
updateCustomerProfileData += "    and profile_type_id  = 609"

var updateContracts = "update gms4.sms_contracts\n"
updateContracts += "  set last_updated = current timestamp\n"
updateContracts += "  where contract_identity = ?"

processPlayers( playerIdList )

function processPlayers( playerIdList )
{
    ibmdb.open( dsn, function ( err, conn )
    {
        ibmdb.debug(true)
        console.error( "DB connected (seconds): " + lib1.elapsedTime( startTime ) )

        var updateCustomerContactsStmt = conn.prepareSync( updateCustomerContacts )
        var updateCustomerServicesStmt = conn.prepareSync( updateCustomerServices )
        var updateCustomerProfileDataStmt = conn.prepareSync( updateCustomerProfileData )
        var updateContractsStmt = conn.prepareSync( updateContracts )

        for ( i = 0; i < playerIdList.length; i++ )
        {
            var playerId = playerIdList[i]
            console.log( "updating " + ( i + 1 ) + ' of ' + ( playerIdList.length - 1 ) + ' ... ' + playerId )

            conn.beginTransaction( function ( err )
            {
                if ( err )
                {
                    //could not begin a transaction for some reason.
                    console.log( err )
                    return conn.closeSync()
                }

                updateCustomerContactsStmt.executeNonQuery( [playerId], function ( err, rows )
                {
                    if ( err ) { console.err( err ) }
                    else { console.log( rows ) }
                } )
                updateCustomerServicesStmt.executeNonQuery( [playerId], function ( err, rows )
                {
                    if ( err ) { console.err( err ) }
                    else { console.log( rows ) }
                } )
                updateCustomerProfileDataStmt.executeNonQuery( [playerId], function ( err, rows )
                {
                    if ( err ) { console.err( err ) }
                    else { console.log( rows ) }
                } )
                updateContractsStmt.executeNonQuery( [playerId], function ( err, rows )
                {
                    if ( err ) { console.err( err ) }
                    else { console.log( rows ) }
                } )

                conn.commitTransactionSync()
            } )
        }

        updateCustomerContactsStmt.closeSync()
        updateCustomerServicesStmt.closeSync()
        updateCustomerProfileDataStmt.closeSync()
        updateContractsStmt.closeSync()
        conn.closeSync()
        conn.close( function ( err ) { } )
    } )
}