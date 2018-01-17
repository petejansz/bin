var request = require( process.env.USERPROFILE  + '/AppData/Roaming/npm/node_modules/request' )

var options = {
    method: 'GET',
    url: 'https://172.25.54.46/california-admin-rest/api/v1/admin/players',
    qs: { email: 'john%@gmail.com', _: '1515087610811' },
    headers:
        {
            'postman-token': '9ac842a1-c2f8-2fe8-50f3-66b52cfe7c2f',
            'cache-control': 'no-cache',
            'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            referer: 'https://172.25.54.46/admin-ui/admin.html?token=NZ8PMXNXZV9XQQH7QLC68CM8B3DEB5',
            dnt: '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
            authorization: 'ESMS NZ8PMXNXZV9XQQH7QLC68CM8B3DEB5',
            'x-requested-with': 'XMLHttpRequest',
            accept: 'application/json, text/javascript, */*; q=0.01'
        }
};

request( options, function ( error, response, body )
{
    if ( error ) throw new Error( error );

    console.log( body );
} );
