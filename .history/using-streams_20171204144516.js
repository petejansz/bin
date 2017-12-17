var fs = require("fs")
var zlib = require('zlib')

// Compress the file input.txt to input.txt.gz
var inputTextFileame = './validation.properties'
var gzipFilename = './input.txt.gz'
fs.createReadStream(inputTextFileame).pipe(zlib.createGzip()).pipe(fs.createWriteStream(gzipFilename))
//fs.createReadStream().pipe(zlib.createGunzip()).pipe(process.stdout)

console.log("File Compressed.")