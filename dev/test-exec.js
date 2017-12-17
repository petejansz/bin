
// Exec an external command

var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
var exec = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/exec' );

exec( ['ls.exe', '-la'], function ( err, out, code )
{
    if ( err instanceof Error )
        throw err;
    process.stderr.write( err );
    process.stdout.write( out );
    process.exit( code );
} );
