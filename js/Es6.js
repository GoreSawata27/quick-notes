// Here’s a concise overview of ES6 (ECMAScript 2015) features

// 1. Let and Const
// let and const are block-scoped.

// let is mutable, const is immutable (for primitive values).

let a = 10;
a = 20;

const b = 30;
// b = 40; ❌ Error

// 2. Arrow Functions
// Shorter syntax and lexical this binding.

const sum = (a, b) => a + b;
console.log(sum(2, 3)); // 5

// 3. Template Literals
// Multi-line strings and expression interpolation.

const Name = "Gore";
console.log(`Hello, ${Name}!`);

// 4. Destructuring Assignment
// Extract values from arrays or objects.

const userOne = { name: "Gore", age_: 25 };
const { name, age_ } = userOne;

// Array Destructuring
const nums = [1, 2];
const [x, y] = nums;

const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// 5. Default Parameters
// Set default values for function parameters.

function greet(name = "Guest") {
  console.log(`Hello, ${name}`);
}
greet(); // Hello, Guest

// 6. Rest and Spread Operators   ... to collect or expand values.

// Rest
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

// Spread
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];

// Modules
// export and import to share code.

// utils.js
export const PI = 3.14;

// main.js
import { PI } from "./utils.js";
// 10. Promises
// Handle async operations.

const fetchData = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve("Done"), 1000);
  });

fetchData().then(console.log);

// 11. For...of Loop
// Iterates over iterable objects like arrays.

for (const num of [1, 2, 3]) {
  console.log(num);
}

// 12. Map and Set
// New data structures.

const set = new Set([1, 2, 2]); // {1, 2}
const map = new Map();
map.set("key", "value");
