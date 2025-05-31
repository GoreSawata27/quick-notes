// Array is a collection of items of the same variable type that are stored at contiguous memory locations.
const arr = [0, 1, 2, 3, 4, 5, 6, 7, 89, 9, 12, 2, 43, 55, 67, 89];

//  The at() method of Array instances takes an integer value and returns the item at that index,
// allowing for positive and negative integers. Negative integers count back from the last item in the array.
console.log(arr.at(8));
console.log(arr.at(-2));

// The concat() method of Array instances is used to merge two or more arrays.
// This method does not change the existing arrays, but instead returns a new array.
const array1 = ["a", "b", "c"];
const array2 = ["d", "e", "f"];
const array3 = array1.concat(array2);

console.log(array3); // Expected output: Array ["a", "b", "c", "d", "e", "f"]

// The every() method of Array instances tests whether all elements
// in the array pass the test implemented by the provided function.
// It returns a Boolean value.

const isBelowThreshold = (currentValue) => currentValue < 40;

const array11 = [1, 30, 39, 29, 10, 13];

console.log(array11.every(isBelowThreshold)); // Expected output: true

// The filter() method of Array instances creates a shallow copy of a portion of a given array,
// filtered down to just the elements from the given array that pass the test implemented by the provided function.

const words = ["spray", "elite", "exuberant", "destruction", "present"];

const result = words.filter((word) => word.length > 6);

console.log(result); // Expected output: Array ["exuberant", "destruction", "present"]

// The find() method of Array instances returns the first element in the provided array that satisfies
// the provided testing function. If no values satisfy the testing function, undefined is returned.

const array10 = [5, 12, 8, 130, 44];

const found = array10.find((element) => element > 10);

console.log(found); // Expected output: 12

// The findIndex() method of Array instances returns the index of the first element in an array
// that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.

const array12 = [5, 12, 8, 130, 44];

console.log(array12.findIndex((num) => num === 130)); // Expected output: 3

// The flat() method of Array instances creates a new array with
// all sub-array elements concatenated into it recursively up to the specified depth.

const arr2 = [0, 1, [2, [3, [4, 5]]]];

console.log(arr2.flat()); // expected output: Array [0, 1, 2, Array [3, Array [4, 5]]]
console.log(arr2.flat(2)); // expected output: Array [0, 1, 2, 3, Array [4, 5]]
console.log(arr2.flat(Infinity)); // expected output: Array [0, 1, 2, 3, 4, 5]

// The forEach() method of Array instances executes a provided function once for each array element.

const array13 = [1, 2, 3, 4, 5];
array13.forEach((element) => console.log(element * 2));

// The includes() method of Array instances determines whether an array includes a
// certain value among its entries, returning true or false as appropriate.

const array0 = [1, 2, 3];
console.log(array0.includes(2)); // Expected output: true

// The indexOf() method of Array instances returns the first index at which a given
// element can be found in the array, or -1 if it is not present.

const beasts = ["ant", "bison", "camel", "duck", "bison"];

console.log(beasts.indexOf("bison")); // Expected output: 1
// Start from index 2
console.log(beasts.indexOf("bison", 2)); // Expected output: 4
console.log(beasts.indexOf("giraffe")); // Expected output: -1

// The join() method of Array instances creates and returns a new string by concatenating all
// of the elements in this array, separated by commas or a specified separator string.
// If the array has only one item, then that item will be returned without using the separator.

const elements = ["Fire", "Air", "Water"];

console.log(elements.join()); // Expected output: "Fire,Air,Water"
console.log(elements.join("")); // Expected output: "FireAirWater"
console.log(elements.join("-")); // Expected output: "Fire-Air-Water"

// The lastIndexOf() method of Array instances returns the last index at which a given element
// can be found in the array, or -1 if it is not present.
// The array is searched backwards, starting at fromIndex.

const animals = ["Dodo", "Tiger", "Penguin", "Dodo"];

console.log(animals.lastIndexOf("Dodo")); // Expected output: 3
console.log(animals.lastIndexOf("Tiger")); // Expected output: 1

// The map() method of Array instances creates a new array populated with the results of
//  calling a provided function on every element in the calling array.

const array14 = [1, 4, 9, 16];
const map1 = array14.map((x) => x * 2);
console.log(map1); // Expected output: Array [2, 8, 18, 32]

// The pop() method of Array instances removes the last element from an array and returns that element.
// This method changes the length of the array.

const plants = ["broccoli", "cauliflower", "cabbage", "kale", "tomato"];

console.log(plants.pop()); // Expected output: "tomato"
console.log(plants); // Expected output: Array ["broccoli", "cauliflower", "cabbage", "kale"]
plants.pop();
console.log(plants); // Expected output: Array ["broccoli", "cauliflower", "cabbage"]

// The push() method of Array instances adds the specified elements to the end of an array and
// returns the new length of the array.

console.log(plants.push("New Plant"));
console.log(plants.push("New Plant 1", "New Plant 2", "New Plant 3"));

// The reduce() method of Array instances executes a user-supplied "reducer" callback function on
// each element of the array, in order, passing in the return value from the calculation on the preceding element.
// The final result of running the reducer across all elements of the array is a single value

// accumulator: The accumulated result returned in the last iteration (or the initialValue for the first iteration).
// currentValue: The current element being processed.
const numbers = [1, 2, 3, 4];

const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

console.log(sum); // 10

// The reverse() method of Array instances reverses an array in place and returns the reference to the same array

const array16 = ["one", "two", "three"];
console.log("array1:", array16); // Expected output: "array1:" Array ["one", "two", "three"]

const reversed = array16.reverse();
console.log("reversed:", reversed); // Expected output: "reversed:" Array ["three", "two", "one"]

// The shift() method of Array instances removes the first element from an array and returns that removed element.
// This method changes the length of the array.
const array17 = [1, 2, 3];

const firstElement = array17.shift();

console.log(array17); // Expected output: Array [2, 3]
console.log(firstElement); // Expected output: 1

// The unshift() method of Array instances adds the specified elements to the beginning of an array
//  and returns the new length of the array.

const lastElement = array17.unshift(0, 3, 5); // [0,3,5,1,2,3] -> 6

// The slice() method of Array instances returns a shallow copy of a portion of an array into a new
// array object selected from start to end (end not included) where start and end represent the index
// of items in that array. The original array will not be modified.

const animals1 = ["ant", "bison", "camel", "duck", "elephant"];

console.log(animals1.slice(2)); // Expected output: Array ["camel", "duck", "elephant"]
console.log(animals1.slice(2, 4)); // Expected output: Array ["camel", "duck"]
console.log(animals1.slice(1, 5)); // Expected output: Array ["bison", "camel", "duck", "elephant"]
console.log(animals1.slice(-2)); // Expected output: Array ["duck", "elephant"]
console.log(animals1.slice(2, -1)); // Expected output: Array ["camel", "duck"]

// The splice() method of Array instances changes the contents of an array by removing or
// replacing existing elements and/or adding new elements in place.

animals1.splice(start, deleteCount, item1, item2);
// start: Index to begin changing the array.
// deleteCount: How many items to remove from that index.
// item1, item2, ...: (Optional) Items to add at that index.

let fruits = ["apple", "banana", "cherry", "date"];
fruits.splice(1, 2); // Removes 2 items starting from index 1
console.log(fruits); // ["apple", "date"]

// some -> based on searched value in array it will give true or false in return

const checkL = fruits.some((vals) => vals.length > 2);
