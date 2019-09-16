#!/usr/bin/env node

// NodeJS IBM DB2 SQL client query tool.
// Pete Jansz, Apr 2019

var ibmdb = require( 'ibm_db' )
var program = require( 'commander' )
var peteUtil = require( 'pete-lib/pete-util' )
var path = require( 'path' )
var fs = require( 'fs' )
var util = require( 'util' )
const scriptName = path.basename( __filename )
// Default connection values:
var dbname = 'GMS4'
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

var connectionString = util.format(
    "DRIVER={DB2};DATABASE=%s;HOSTNAME=%s;UID=%s;PWD=%s;PORT=%s;PROTOCOL=TCPIP",
    dbname, hostname, uid, pwd, port )

var sqlStatement = null

if ( program.sqlstmt )
{
    sqlStatement = program.sqlstmt
}
else
{
    sqlStatement = fs.readFileSync( program.sqlfile ).toString()
}

var startTime = new Date()
if ( program.verbose )
{
    console.error( util.format( 'Connect-string( "%s" )', connectionString ) )
}

var options = { connectTimeout: 40, systemNaming: true }
try
{
    var conn = ibmdb.openSync( connectionString, options )

    if ( program.verbose )
    {
        console.error( "DB connected (seconds): " + peteUtil.elapsedTime( startTime ) )
    }


    var sqlQuery = { "sql": sqlStatement, "params": null, "noResults": false }

    // if ( sqlStatement.trim().match( /^SELECT/i ) )
    // {
        doQuery( conn, sqlQuery )
    // }
    // else // rows affected, no resultset
    // {
    //     doNonQuery( conn, preparedStmt, values )
    // }

    conn.closeSync()
}
catch ( e )
{
    console.error( e.message )
}

function doNonQuery( conn, paramedStmt, values )
{
    conn.prepare( paramedStmt, function ( err, stmt )
    {
        if ( err )
        {
            console.error( err )
        }

        //Bind and Execute the statment asynchronously
        stmt.executeNonQuery( [42, 'hello world'], function ( err, ret )
        {
            if ( err )
            {
                console.error( err )
            }
            else
            {
                console.log( "Affected rows = " + ret )
            }
        } );
    } );
}

function doQuery( conn, sqlQuery )
{
    var result = conn.queryResultSync( sqlQuery )

    if ( program.csv )
    {
        var sep = ','
        var stringArray = peteUtil.convertJSONToStringArray( result.fetchAllSync(), sep )

        stringArray.forEach( function ( elem )
        {
            console.log( elem )
        } );

        result.closeSync()
    }
    else
    {
        console.log( JSON.stringify( result.fetchAllSync() ) )
    }
}