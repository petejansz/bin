var mns = require('./my-namespace')
var fs = require( 'fs' )
var util = require( 'util' )
var ibmdb = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/ibm_db' )
var program = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/commander' )
var path = require( 'path' )

//console.log(mns)
// Outside of the anonymous function, can access the following:
//console.log(mns.mynamespace.foo)    // "Yes, this is foo."
//console.log(mns.mynamespace.fooTwo());   // "Yes, this is foo.Yes, this is foo."

// The instantiated CoolClass object, and public members
console.log(mns.mynamespace.coolObject)
//console.log(mynamespace.coolObject.bar)        // "A bar."
//console.log(mynamespace.coolObject.barThree()); // "A bar.A bar.A bar."

// Constructor for CoolClass
//console.log(new mns.mynamespace.CoolClass())