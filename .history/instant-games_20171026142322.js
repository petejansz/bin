var request = require( process.env.USERPROFILE + "/AppData/Roaming/npm/node_modules/request" );

var options = {
    method: 'POST',
    url: 'https://204.214.50.27/api/v1/instant-games/tickets/inquire',
    headers:
    {
        'postman-token': 'b975a87e-abc1-2252-126c-aebdf61ca485',
        'cache-control': 'no-cache',
        'x-originator-id': '10001,2,3,4',
        'x-site-id': '35',
        'x-channel-id': '2',
        'x-ex-system-id': '8',
        'content-type': 'application/json'
    },
    body: { barcode: '1010-1001201-000-440113192-219' },
    json: true
};

request( options, function ( error, response, body )
{
    if ( error ) throw new Error( error );

    console.log( body );
} );
