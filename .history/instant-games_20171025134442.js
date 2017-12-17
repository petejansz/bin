var http = require("https");

var options = {
  "method": "POST",
  "hostname": "ca-cat-b2b.lotteryservices.com",
  "port": null,
  "path": "/api/v1/instant-games/tickets/inquire",
  "headers": {
    "content-type": "application/json",
    "x-ex-system-id": "8",
    "x-channel-id": "2",
    "x-site-id": "35",
    "cache-control": "no-cache",
    "postman-token": "aef1ea17-999c-3d51-6ea8-1a8d94219f68"
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