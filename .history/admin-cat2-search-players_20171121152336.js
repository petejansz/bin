var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )

var options = {
    method: 'GET',
    url: 'https://10.164.172.245/california-admin-rest/api/v1/admin/players',
    qs: { email: 'zzzz%', _: '1511305891634' },
    headers:
        {
            'cache-control': 'no-cache',
            referer: 'https://10.164.172.245/admin-ui/admin.html?token=GRROWP4M5D6NH5IMHX1YBHNIJJEVQ8',
            dnt: '1',
            Authorization: 'ESMS GRROWP4M5D6NH5IMHX1YBHNIJJEVQ8',
            accept: 'application/json, text/javascript, */*; q=0.01'
        }
};

request( options, function ( error, response, body )
{
    if ( error ) throw new Error( error );

    console.log( body );
} );
