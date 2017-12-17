var http = require( "https" );

var options = {
    "method": "POST",
    "hostname": "204.214.50.24",
    "port": null,
    "path": "/api/v1/instant-games/tickets/inquire",
    "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "x-ex-system-id": "8",
        "x-channel-id": "2",
        "x-site-id": "35",
        "x-originator-id": "10001,2,3,4",
        "cache-control": "no-cache",
        "postman-token": "85b9fffb-d769-fa40-5b5f-72c2c169170d"
    }
};

var body =
    {
        "barcode": "1010-1001201-000-440113192-219"
    };

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

req.end();