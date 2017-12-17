const through2 = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/through2' )

const toUpperCase = through2( ( data, encoding, callback ) =>
{
    callback( null, new Buffer( data.toString().toUpperCase() ) )
} )

const rmVowels = through2( ( data, enc, callback ) =>
{
    var novowels = data.toString().replace(/a|e|i|o|u/ig, ' ')

    callback( null, new Buffer( novowels ) )
} )

const dashBetweenWords = through2( ( data, encoding, callback ) =>
{
    callback( null, new Buffer( data.toString().split( ' ' ).join( '_' ) ) )
} )

process.stdin
    .pipe( toUpperCase )
    .pipe( rmVowels )
    .pipe( dashBetweenWords )
    .pipe( process.stdout )
