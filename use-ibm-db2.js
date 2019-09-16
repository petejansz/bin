#!/usr/bin/env node

// NodeJS IBM DB2 SQL client query tool.
// Pete Jansz, Oct 2017

var ibmdb = require( 'ibm_db' )
var program = require( 'commander' )
var peteUtil = require( 'pete-lib/pete-util' )
var path = require( 'path' )
var fs = require( 'fs' )
var util = require( 'util' )
const scriptName = path.basename( __filename )
// Default connection values:
var dbname = "GMS4"
var hostname = '156.24.32.127'
var uid = 'b2cinst1'
var pwd = 'b2cinst1'
var port = 55000

program
    .version( '0.0.1' )
    .description( 'NodeJS IBM DB2 SQL client' )
    .usage( scriptName + ' -f sqlfile | ssqlstmt' )
    .option( '-c, --csv', 'CSV output' )
    .option( '-d, --dbname [dbname]', util.format( 'DB name (default=%s)', dbname ) )
    .option( '-f, --sqlfile [sqlfile]', 'SQL file' )
    .option( '-s, --sqlstmt [sqlstmt]', 'SQL statement' )
    .option( '-h, --hostname [hostname]', util.format( 'DB2 host (default=%s)', hostname ) )
    .option( '-p, --port [port]', util.format( 'DB2 port number (default=%s)', port ), parseInt )
    .option( '-u, --username [username]', util.format( 'DB2 username (default=%s)', uid ) )
    .option( '-P, --password [password]', util.format( 'Password (default=%s)', pwd ) )
    .option( '-v, --verbose', 'Verbose mode' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.sqlfile && !program.sqlstmt )
{
    program.help()
}

if ( program.hostname ) { hostname = program.hostname }
if ( program.port ) { port = program.port }
if ( program.dbname ) { dbname = program.dbname }
if ( program.username ) { uid = program.username }
if ( program.password ) { pwd = program.password }

var dsn = util.format(
    "DRIVER={DB2};DATABASE=%s;HOSTNAME=%s;UID=%s;PWD=%s;PORT=%s;PROTOCOL=TCPIP",
    dbname, hostname, uid, pwd, port )

var startTime = new Date()
    if (program.verbose)
    {
        console.error( util.format( "Connecting to: %s://%s:%s", hostname, dbname, port ) )
    }

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
    if (program.verbose)
    {
        console.error( "DB connected (seconds): " + peteUtil.elapsedTime( startTime ) )
    }

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

