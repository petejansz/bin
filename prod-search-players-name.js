var http = require("https");

var options = {
  "method": "GET",
  "hostname": "172.25.54.46",
  "port": null,
  "path": "/california-admin-rest/api/v1/admin/players?firstName=pe%25&lastName=smith&_=1515088014377",
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "x-requested-with": "XMLHttpRequest",
    "authorization": "ESMS NZ8PMXNXZV9XQQH7QLC68CM8B3DEB5",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
    "dnt": "1",
    "referer": "https://172.25.54.46/admin-ui/admin.html?token=NZ8PMXNXZV9XQQH7QLC68CM8B3DEB5",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,fr;q=0.8",
    "cache-control": "no-cache",
    "postman-token": "17aaf58e-1ecb-1bf1-61f7-97947cf5333f"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();