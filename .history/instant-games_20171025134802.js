var http = require( "https" );

var options =
{
    "method": "POST",
    "hostname": "10.253.164.8",
    "port": 8580,
    "path": "/api/v1/instant-games/tickets/inquire",
    "headers": {
        "content-type": "application/json",
        "x-ex-system-id": "8",
        "x-channel-id": "2",
        "x-site-id": "35",
        "cache-control": "no-cache"
    }
};

var jsonBody =
{
    barcode: "44029871005000116397747686"
}

var req = http.request( options, function ( res )
{
    var chunks = [];

    res.on( "data", function ( chunk )
    {
        chunks.push( chunk );
    } );

    res.on( "end", function ()
    {
        var body = Buffer.concat( chunks );
        console.log( body.toString() );
    } );
} );

req.write( JSON.stringify( jsonBody ) );
req.end();