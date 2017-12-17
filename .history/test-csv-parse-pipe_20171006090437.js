var fs = require('fs');
var parse = require(process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv/node_modules/csv-parse');
var transform = require(process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/csv/node_modules/stream-transform');

var parser = parse({delimiter: ':'})
var input = fs.createReadStream('/etc/passwd');
var transformer = transform(function(record, callback){
  setTimeout(function(){
    callback(null, record.join(' ')+'\n');
  }, 500);
}, {parallel: 10});
input.pipe(parser).pipe(transformer).pipe(process.stdout);