var fs = require( "fs" )
var path = require( "path" )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )
var xml2js = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/xml2js' )
const regex = /^TCB Index Stats:[\s\S]*\n/g
var xmlFilename = process.env.USERPROFILE + '/Documents/pd/california/pom.xml'
var xmlStr = fs.readFileSync( xmlFilename ).toString()
