// var mod = require('./module')
// var processes = require('./processes-lib')

// mod.publicMethod( 'Hello!' )
// mod.prDate()
// processes.createNote('localhost', 1000004997)

var OAuth = require('./oauth.js')
var oAuth1 = new OAuth('cadev1', 'test50@yopmail.com', 'Password123', console.log)