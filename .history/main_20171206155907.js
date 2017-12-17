var fs = require( 'fs' )
var path = require( 'path' )
var util = require( 'util' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var oauthclass = require( process.env.USERPROFILE + '/Documents/bin/oauth.js' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

var oauth = new oauthclass.OAuth('cadev1', lib1.commonHeaders)