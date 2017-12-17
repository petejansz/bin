// https://www.npmjs.com/package/xml-js
var fs = require( "fs" )
var path = require( "path" )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var convert = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/xml-js' )

var xmlFilename = process.env.USERPROFILE + '/Documents/pd/california/pom.xml'
var xmlStr = fs.readFileSync( xmlFilename ).toString()

// Convert XML to JSON object:
var json = convert.xml2js( xmlStr )
//console.log(JSON.stringify(json))

// Convert XML to JSON string:
var jsonString = convert.xml2json( xmlStr, { compact: true, spaces: 2 } )
//console.log(jsonString)

// Convert JSON to XML string:
var options = { ignoreComment: true, spaces: 2 }
var back2XmlStr = convert.json2xml( json, options )
console.log( back2XmlStr )
