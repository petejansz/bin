var request = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/request' )

var options = { method: 'GET',
  url: 'http://10.164.172.231/california-admin-rest/api/v1/admin/players',
  qs: { email: 'bguy@calottery.com', _: '1511797015071' },
  headers:
   { 'postman-token': '0fdc2e8e-d7dc-5e19-e763-ee63016e680c',
     'cache-control': 'no-cache',
     cookie: 'JSESSIONIDSSO=+FAZPdI-V+f2I9bdwTsPqjpe',
     'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
     'accept-encoding': 'gzip, deflate',
     referer: 'http://10.164.172.231/admin-ui/admin.html?token=2081YK8SVV1GND4XCCKQS19P4SRZT4',
     dnt: '1',
     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
     authorization: 'ESMS 2081YK8SVV1GND4XCCKQS19P4SRZT4',
     'x-requested-with': 'XMLHttpRequest',
     accept: 'application/json, text/javascript, */*; q=0.01' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
