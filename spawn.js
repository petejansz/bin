/**
 * Spawn (run a program), wait for completion, write result to stdout/stderr.
 */

var util = require( 'util' )
var program = require( 'commander' )
const { spawnSync } = require( 'child_process' )

const BIN_PATH = 'C:/Users/pjansz/Documents/bin/'
program
    .version( '0.0.1' )
    .description( 'NodeJS CLI to spawn a process' )
    //.usage( '-h <host> -i <playerid>' )
    .option( '-e, --exec <filename>', 'filename' )
    .option( '-a, --itsargs <itsargs>', 'quoted args, e.g., "-a foo -b bah"' )
    .parse( process.argv )

process.exitCode = 1

if ( !program.exec || !program.itsargs )
{
    program.help()
}

var engine = 'node'

if ( program.exec.endsWith( 'ps1' ) )
{
    engine = 'PowerShell.exe -NoLogo -NonInteractive -Command '
}

const proc = spawnSync( engine, [program.exec, program.itsargs], { shell: true } )

if ( proc.status != 0 )
{
    console.log( proc.stderr.toString() )
    process.exit()
}

console.log( proc.stdout.toString() )
process.exitCode = 0
