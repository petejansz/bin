// https://googlechrome.github.io/samples/classes-es6/
// Classes (ES6) Sample
'use strict'

// A base class is defined using the new reserved 'class' keyword
class Polygon
{
    // ..and an (optional) custom class constructor. If one is
    // not supplied, a default constructor is used instead:
    // constructor() { }
    constructor( height, width )
    {
        this.name = 'Polygon';
        this.height = height;
        this.width = width;
    }

    // Simple class instance methods using short-hand method
    // declaration
    sayName()
    {
        console.log( 'Hi, I am a ', this.name + '.' );
    }

    sayHistory()
    {
        console.log( '"Polygon" is derived from the Greek polus (many) ' +
            'and gonia (angle).' );
    }
}

class Square extends Polygon
{
    constructor( length )
    {
        // The reserved 'super' keyword is for making super-constructor
        // calls and allows access to parent methods.
        //
        // Here, it will call the parent class' constructor with lengths
        // provided for the Polygon's width and height
        super( length, length );
        // Note: In derived classes, super() must be called before you
        // can use 'this'. Leaving this out will cause a reference error.
        this.name = 'Square';
    }

    // Getter/setter methods are supported in classes,
    // similar to their ES5 equivalents
    get area()
    {
        return this.height * this.width;
    }

    set area( value )
    {
        this.area = value;
    }
}

class Rectangle extends Polygon
{
    constructor( height, width )
    {
        super( height, width );
        this.name = 'Rectangle';
    }
    // Here, sayName() is a subclassed method which
    // overrides their superclass method of the same name.
    sayName()
    {
        console.log( 'Sup! My name is ', this.name + '.' );
        super.sayHistory();
    }
}

// Classes support static members which can be accessed without an
// instance being present.
class Triple
{
    // Using the 'static' keyword creates a method which is associated
    // with a class, but not with an instance of the class.
    static triple( n )
    {
        n = n || 1;
        return n * 3;
    }
}

// super.prop in this example is used for accessing super-properties from
// a parent class. This works fine in static methods too:
class BiggerTriple extends Triple
{
    static triple( n )
    {
        return super.triple( n ) * super.triple( n );
    }
}

// console.log( Triple.triple() );
// console.log( Triple.triple( 6 ) );
// console.log( BiggerTriple.triple( 3 ) );

var serviceBase = { port: 3000, url: 'azat.co' },
    getAccounts = function () { return [1, 2, 3] }
var accountService = {
    __proto__: serviceBase,
    getAccounts,
    toString()
    {
        return JSON.stringify( ( super.valueOf() ) )
    },
    getUrl() { return "http://" + this.url + ':' + this.port },
    ['valueOf_' + getAccounts().join( '_' )]: getAccounts()
};
console.log( accountService )