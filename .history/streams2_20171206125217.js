const through2 = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/through2' )

const toUpperCase = through2( ( data, enc, cb ) =>
{
    cb( null, new Buffer( data.toString().toUpperCase() ) )
} )

const dashBetweenWords = through2( ( data, enc, cb ) =>
{
    cb( null, new Buffer( data.toString().split( ' ' ).join( '-' ) ) )
} )

console.log('start')
process.stdin
    .pipe( toUpperCase )
    .pipe( dashBetweenWords )
    .pipe( process.stdout )

console.log('end')
