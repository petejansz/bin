var fs = require( "fs" )
var path = require( "path" )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var convert = require(process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/xml-js')

var xmlFilename = process.env.USERPROFILE + '/Documents/pd/california/pom.xml'
var xmlStr = fs.readFileSync( xmlFilename ).toString()

var result1 = convert.xml2json(xmlStr, {compact: false, spaces: 2})
console.log(result1)
