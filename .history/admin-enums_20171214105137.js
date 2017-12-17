var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

process.exitCode = 1

function myResponseHandler( response )
{
    if ( response.statusCode == 200 )
    {
        console.log( response.body.toString() )
        process.exitCode = 0
    }
    else
    {
        console.error( response.statusCode + ", " + response.statusMessage )
    }
}

lib1.getAdminEnums( myResponseHandler )
