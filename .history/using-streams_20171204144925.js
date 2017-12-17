var fs = require("fs")
var zlib = require('zlib')

// Compress the file input.txt to input.txt.gz
var inputTextFilename = './validation.properties'
var gzipFilename = './input.txt.gz'

// cat textFilename | gzip gzipFilename:
//fs.createReadStream(inputTextFilename).pipe(zlib.createGzip()).pipe(fs.createWriteStream(gzipFilename))

// gunzip gzipFilename #
fs.createReadStream().pipe(zlib.createGunzip()).pipe(process.stdout)

console.log("File Compressed.")