var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )

var options =
{
  method: 'GET',
  url: 'http://10.164.172.231/california-admin-rest/api/v1/admin/players',
  qs: { email: 'bguy@calottery.com', _: '1511797015071' },
  headers:
   {
     'cache-control': 'no-cache',
     referer: 'http://10.164.172.231/admin-ui/admin.html?token=2081YK8SVV1GND4XCCKQS19P4SRZT4',
     dnt: '1',
     authorization: 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4',
     'x-requested-with': 'XMLHttpRequest',
     accept: 'application/json, text/javascript, */*; q=0.01'
    }
}

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
