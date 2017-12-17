
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' );
const { exec } = require( 'child_process' );
const { spawn } = require( 'child_process' );

//const ls = spawn( 'ls.exe', ['-la', '.'] );
const ls = spawn( 'node', ['players-verify.js'],
    {
        //stdio: 'inherit',
        shell: true
    }
);

console.log('PID: ' + ls.pid);

ls.stdout.on( 'data', ( data ) =>
{
    console.log( `stdout: ${data}` );
} );

ls.stderr.on( 'data', ( data ) =>
{
    console.log( `stderr: ${data}` );
} );

ls.on( 'close', ( code ) =>
{
    console.log( `child process exited with code ${code}` );
} );

// // spawns a shell and runs a command within that shell, passing the stdout and stderr to a callback function when complete.
// exec( 'cat.exe learn_exec.js | wc.exe -l', ( err, stdout, stderr ) =>
// {
//     if ( err )
//     {
//         // node couldn't execute the command
//         console.error( `exec error: ${err}` );
//         console.log( 'Exit code: ' + err.code );
//         return;
//     }

//     // the *entire* stdout and stderr (buffered)
//     if ( stdout != '' )
//         console.log( `stdout: ${stdout}` );

//     if ( stderr != '' )
//         console.log( `stderr: ${stderr}` );
// } );