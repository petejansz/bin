var fs = require( "fs" )
var path = require( "path" )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
const regex = /^TCB Index Stats:[\s\S]*\n/g
var tcbstatsFilename = process.env.USERPROFILE + '/Documents/pd/california/dev/stats-no-opts.txt'
var tcbstats = fs.readFileSync( tcbstatsFilename ).toString()

var m;

while ( ( m = regex.exec( tcbstats ) ) !== null )
{
    // This is necessary to avoid infinite loops with zero-width matches
    if ( m.index === regex.lastIndex )
    {
        regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach( ( match, groupIndex ) =>
    {
        console.log( `Found match, group ${groupIndex}: ${match}` );
    } );
}
