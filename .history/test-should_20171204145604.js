// assertions with should
var should = require( process.env.USERPROFILE + '/AppData/Roaming/npm/node_modules/should' );

var user = {
    name: 'tj'
    , pets: ['tobi', 'loki', 'jane', 'bandit']
};

user.should.have.property( 'name', 'tj' );
user.should.have.property( 'pets' ).with.lengthOf( 4 );
should( user ).have.property( 'name', 'tj' );

(5).should.be.exactly(5).and.be.a.Number();
//should(10).be.exactly(5).and.be.a.Number();

// also you can test in that way for null's
should( null ).not.be.ok();

// someAsyncTask( foo, function ( err, result )
// {
//     should.not.exist( err );
//     should.exist( result );
//     result.bar.should.equal( foo );
// } );