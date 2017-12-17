var fs = require( 'fs' )
var path = require( 'path' )
var util = require( 'util' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
const {OAuth} = require( process.env.USERPROFILE + '/Documents/bin/oauth' )
var lib1 = require( process.env.USERPROFILE + "/Documents/bin/lib1.js" )

var oauth = new OAuth( 'cadev1', lib1.commonHeaders )
// OAuth.getAuthCode(oauth, 'test5@yopmail.com', 'RegTest6100', handler )

// function handler(response)
// {
//     console.log(response)
// }