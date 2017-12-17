'use strict'

// A base class is defined using the new reserved 'class' keyword
class Polygon
{
    // ..and an (optional) custom class constructor. If one is
    // not supplied, a default constructor is used instead:
    // constructor() { }
    constructor(height, width)
    {
      this.name = 'Polygon';
      this.height = height;
      this.width = width;
    }

    // Simple class instance methods using short-hand method
    // declaration
    sayName()
    {
      console.log('Hi, I am a ', this.name + '.');
    }

    sayHistory()
    {
        console.log('"Polygon" is derived from the Greek polus (many) ' +
        'and gonia (angle).');
    }
}

let p = new Polygon(300, 400);
p.sayName();
console.log('The width of this polygon is ' + p.width);
