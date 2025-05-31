// 1. ReferenceError
// Occurs when you reference a variable that hasn’t been declared,
// or access it before initialization (in let or const).

console.log(a); // ReferenceError: a is not defined
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// 2. TypeError
// Occurs when a value is not of the expected type,
// or you try to perform an invalid operation on a data type.

null.f(); // TypeError: Cannot read properties of null

let num = 5;
num.toUpperCase(); // TypeError: num.toUpperCase is not a function

// 3. SyntaxError
// Occurs when the code has a syntax mistake and can’t be parsed by the JavaScript engine.

// if (true { console.log("hi"); } // SyntaxError: Unexpected token '{'

// 4. RangeError
// Occurs when a value is not within an expected set or range. Common with numbers, arrays, or string operations.

let arr = new Array(-1); // RangeError: Invalid array length

(10).toPrecision(500); // RangeError: toPrecision() argument must be between 1 and 100

//  InternalError (non-standard, Firefox specific)
// Raised by the JS engine itself for things like recursion limits.

function recurse() {
  recurse();
}
recurse(); // InternalError: too much recursion
