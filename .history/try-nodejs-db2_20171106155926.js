// First NodeJS database (DB2) query tool.
// Pete Jansz, Oct 2017

var fs = require( 'fs' );
var util = require( 'util' );
var ibmdb = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/ibm_db' );
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var path = require( 'path' );
var scriptName = path.basename( __filename );

program
    .version( '0.0.1' )
    .description( 'NodeJS SQL ...' )
    .usage( scriptName + ' -f sqlfile | ssqlstmt' )
    .option( '-c, --csv', 'CSV output' )
    .option( '-f, --sqlfile [sqlfile]', 'SQL file' )
    .option( '-s, --sqlstmt [sqlstmt]', 'SQL statement' )
    .option( '-h, --hostname [hostname]', 'DB2 host' )
    .option( '-p, --port [port]', 'DB2 port number (default=55000)', parseInt )
    .option( '-u, --username [username]', 'DB2 username' )
    .option( '-P, --password [password]', 'Password' )
    .parse( process.argv );

var exitValue = 0;

if ( !program.sqlfile && !program.sqlstmt )
{
    program.help();
    process.exit( 1 );
}

// Default connection values:
var dbname = "GMS4";
var hostname = '156.24.32.127';
var uid = 'b2cinst1';
var pwd = 'b2cinst1';
var port = 55000;

if ( program.hostname ) { hostname = program.hostname; }
if ( program.port ) { port = program.port; }
if ( program.dbname ) { dbname = program.dbname; }
if ( program.username ) { uid = program.username; }
if ( program.password ) { pwd = program.password; }

var dsn = util.format( "DRIVER={DB2};DATABASE=%s;HOSTNAME=%s;UID=%s;PWD=%s;PORT=%s;PROTOCOL=TCPIP", dbname, hostname, uid, pwd, port );

var startTime = new Date();
console.error( util.format( "Connecting to: %s://%s:%s", hostname, dbname, port ) );

var sqlStatement = null;

if ( program.sqlstmt )
{
    sqlStatement = program.sqlstmt
}
else
{
    sqlStatement = fs.readFileSync( program.sqlfile ).toString();
}

var conn = ibmdb.open( dsn, function ( err, conn )
{
    console.error( "DB connected (seconds): " + elapsedTime( startTime ) );

    if ( err )
    {
        console.error( "error: ", err.message );
        process.exit( 1 );
    }
    else
    {
        conn.query( sqlStatement, function ( err, jsonResultset, moreResultSets )
        {
            if ( err )
            {
                console.error( err );
            }
            else
            {
                if ( program.csv )
                {
                    var sep = ',';
                    var stringArray = convertJSONToStringArray( jsonResultset, sep );
                    stringArray.forEach( function ( elem )
                    {
                        console.log( elem );
                    } );
                }
                else
                {
                    console.log( jsonResultset.toString() );
                }
            }
            conn.close( function ()
            {
                //console.log( 'done' );
            } );
        } );
    }
} );

function convertJSONToStringArray( data, sep )
{
    var stringArray = [];

    var columnNames = Object.keys( data[0] );
    var headers = columnNames.join( sep );
    stringArray.push( headers );

    for ( var i = 1; i < data.length; i++ )
    {
        var row = data[i];
        var values = [];
        columnNames.forEach( function ( columnName )
        {
            values.push( row[columnName] );
        } );

        stringArray.push( values.join( sep ) );
    }

    return stringArray;
}

function elapsedTime( startTime )
{
    var endTime = new Date();
    var timeDiffMilliseconds = endTime - startTime;
    // strip the ms
    var timeDiffSeconds = timeDiffMilliseconds /= 1000;

    // get seconds
    return Math.round( timeDiffSeconds );
}