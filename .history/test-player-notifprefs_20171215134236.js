/**
 * NodeJS CLI to players/self get attributes.
 * Demonstrates use of request-promise, accepting oauth token from stdin,
 *  making synchronous (async/await) a promised function
 * Pete Jansz Dec 2017
 */

var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
const fs = require( 'fs' )
const path = require( 'path' )
var util = require( 'util' ) // to support async/await(promised-func)

program
    .version( '0.0.1' )
    .description( 'NodeJS CLI to players/self get attributes' )
    .usage( '-f file' )
    .option( '-f, --file <file>', 'filename' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.file )
{
    program.help()
}

    var objStr = fs.readFileSync(path.resolve(program.file)).toString()
    var obj = JSON.parse(objStr)

    for (i=0; i<obj.value.length; i++)
    {
        var item  = obj.value[i]
        if (item.id.match(/host|winning/ig))
        {
            var o2 = {}
            o2.name = item.id
            o2.emailEnabled = item.channels.EMAIL.enabled
            console.log(JSON.stringify(o2))

        }
    }
