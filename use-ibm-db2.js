// NodeJS IBM DB2 SQL client query tool.
// Pete Jansz, Oct 2017

const modulesPath = '/usr/share/node_modules/'
var ibmdb = require( modulesPath + '/ibm_db' )
var program = require( modulesPath + 'commander' )
var peteUtil = require( modulesPath + 'pete-lib/pete-util' )
var path = require( 'path' )
var fs = require( 'fs' )
var util = require( 'util' )
const scriptName = path.basename( __filename )

program
    .version( '0.0.1' )
    .description( 'NodeJS IBM DB2 SQL client' )
    .usage( scriptName + ' -f sqlfile | ssqlstmt' )
    .option( '-c, --csv', 'CSV output' )
    .option( '-f, --sqlfile [sqlfile]', 'SQL file' )
    .option( '-s, --sqlstmt [sqlstmt]', 'SQL statement' )
    .option( '-h, --hostname [hostname]', 'DB2 host' )
    .option( '-p, --port [port]', 'DB2 port number (default=55000)', parseInt )
    .option( '-u, --username [username]', 'DB2 username' )
    .option( '-P, --password [password]', 'Password' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.sqlfile && !program.sqlstmt )
{
    program.help()
}

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

var dsn = util.format(
    "DRIVER={DB2};DATABASE=%s;HOSTNAME=%s;UID=%s;PWD=%s;PORT=%s;PROTOCOL=TCPIP",
    dbname, hostname, uid, pwd, port )

var startTime = new Date()
console.error( util.format( "Connecting to: %s://%s:%s", hostname, dbname, port ) )

var sqlStatement = null

if ( program.sqlstmt )
{
    sqlStatement = program.sqlstmt
}
else
{
    sqlStatement = fs.readFileSync( program.sqlfile ).toString()
}

var conn = ibmdb.open( dsn, function ( err, conn )
{
    console.error( "DB connected (seconds): " + peteUtil.elapsedTime( startTime ) )

    if ( err )
    {
        console.error( "error: ", err.message )
    }
    else
    {
        conn.query( sqlStatement, function ( err, jsonResultset, moreResultSets )
        {
            if ( err )
            {
                console.error( err )
            }
            else
            {
                if ( program.csv )
                {
                    var sep = ','
                    var stringArray = peteUtil.convertJSONToStringArray( jsonResultset, sep )
                    stringArray.forEach( function ( elem )
                    {
                        console.log( elem )
                    } );
                }
                else
                {
                    console.log( JSON.stringify(jsonResultset) )
                }

                process.exitCode = 0
            }
            conn.close( function ()
            {
                //console.log( 'done' );
            } );
        } );
    }
} );

