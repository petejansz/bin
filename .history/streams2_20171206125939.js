const through2 = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/through2' )

const toUpperCase = through2( ( data, enc, cb ) =>
{
    cb( null, new Buffer( data.toString().toUpperCase() ) )
} )

const toLowerCase = through2( ( data, enc, cb ) =>
{
    cb( null, new Buffer( data.toString().toLowerCase() ) )
} )

const dashBetweenWords = through2( ( data, enc, cb ) =>
{
    cb( null, new Buffer( data.toString().split( ' ' ).join( '-' ) ) )
} )

process.stdin
    .pipe( toUpperCase )
    .pipe( toLowerCase )
    .pipe( dashBetweenWords )
    .pipe( process.stdout )
