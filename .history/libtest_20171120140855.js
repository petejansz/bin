// var mod = require('./module')
// var processes = require('./processes-lib')

// mod.publicMethod( 'Hello!' )
// mod.prDate()
// processes.createNote('localhost', 1000004997)

var OAuth = require('./oauth.js')
var oAuth = new OAuth('cadev1')
OAuth.getAuthCode(oAuth, 'test50@yopmail.com', 'Password123', responseHandler)

function responseHandler(response)
{
    var authCode = response
    OAuth.getToken(oAuth, authCode, tokenHandler)
}