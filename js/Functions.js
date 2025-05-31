// HOC
// A Higher-Order Function (HOF) is a function that

// Takes one or more functions as arguments

// Returns another function as its result

function greet(name) {
  return `Hello ${name}`;
}

function printName(callback) {
  const name = "gore";
  return callback(name);
}

console.log(printName(greet)); // Hello gore

// First-Class Functions

// functions are first-class citizens — they can be:

// Assigned to variables
// Passed as arguments
// Returned from other functions
// Stored in arrays/objects

// Callback Functions

// A callback function is a function passed as an argument to another function and
// is executed later, usually after some operation is done.

function fetchData(callback) {
  setTimeout(() => {
    console.log("Data fetched");
    callback(); // call the function passed
  }, 1000);
}

function onFetchComplete() {
  console.log("Now processing data...");
}

fetchData(onFetchComplete);
