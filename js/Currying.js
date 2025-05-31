// A function which takes a argument at a time and returns a new function expecting new argument

function addition(x) {
  return (y) => {
    return (z) => {
      return x + y + z;
    };
  };
}
const result = addition(1)(2)(3);

console.log(result);
