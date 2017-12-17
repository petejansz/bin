var Readable = require( 'stream' ).Readable;

var rs = new Readable;
rs.push( 'beep ' );
rs.push( 'boop\n' );
rs.push( null );

console.log('Done pushing')
rs.pipe( process.stdout )
console.log('Done, done.')
