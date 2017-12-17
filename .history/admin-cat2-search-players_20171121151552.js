var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )

var options = {
    method: 'GET',
    url: 'https://10.164.172.245/california-admin-rest/api/v1/admin/players',
    qs: { email: 'zzzz%', _: '1511305891634' },
    headers:
        {
            'postman-token': '4338c47e-1148-0b89-2455-b116f7f66144',
            'cache-control': 'no-cache',
            cookie: 'JSESSIONIDSSO=uTiUTi35EPBaWRmE+xXjH5dR',
            'accept-language': 'en-US,en;q=0.8,fr;q=0.6',
            'accept-encoding': 'gzip, deflate, br',
            referer: 'https://10.164.172.245/admin-ui/admin.html?token=GRROWP4M5D6NH5IMHX1YBHNIJJEVQ8',
            dnt: '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
            authorization: 'ESMS GRROWP4M5D6NH5IMHX1YBHNIJJEVQ8',
            'x-requested-with': 'XMLHttpRequest',
            accept: 'application/json, text/javascript, */*; q=0.01'
        }
};

request( options, function ( error, response, body )
{
    if ( error ) throw new Error( error );

    console.log( body );
} );
