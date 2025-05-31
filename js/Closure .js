// A function bundled together with its lexical environment

// This means a function "remembers" the variables from where it was defined,
// even after that outer function has finished executing.

// Lexical Environment
// The place in the code where variables and functions are physically written (lexically placed),
// and the scope they create.

function counter() {
  let count = 0; // this is part of the lexical environment

  return function () {
    count++; // inner function "remembers" `count`
    return count;
  };
}

const increment = counter();

console.log(increment()); // 1
console.log(increment()); // 2
console.log(increment()); // 3

// counter() returns an inner function.

// That inner function closes over count — it remembers count from its lexical environment.

// Even after counter() has finished executing, the inner function keeps access to count.
