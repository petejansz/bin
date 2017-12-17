var fs = require( "fs" )
var path = require( "path" )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var convert = require(process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/xml-js')

var xmlFilename = process.env.USERPROFILE + '/Documents/pd/california/pom.xml'
var xmlStr = fs.readFileSync( xmlFilename ).toString()

var result1 = convert.xml2json(xmlStr, {compact: true, spaces: 4})
var result2 = convert.xml2json(xmlStr, {compact: false, spaces: 4})
console.log(result2)//, '\n', result2)

function tryXml2js( xmlString )
{
    var xml2js = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/xml2js' )

    var parser = new xml2js.Parser()
    parser.parseString( xmlString, function ( err, jsonData )
    {
        console.dir( JSON.stringify( jsonData ) );
    } );
}

