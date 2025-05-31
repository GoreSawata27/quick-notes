//  A JavaScript Promise is an object that represents the eventual completion
// or failure of an asynchronous operation and its resulting value

// A JavaScript Promise has three states  in its lifecycle:

// 1. Pending
// The initial state.
// The async operation is still in progress.
// Neither resolve nor reject has been called.

// 2. Fulfilled
// The operation completed successfully.
// resolve(value) was called.
// The .then() handler gets triggered.

// 3. Rejected
// The operation failed.
// reject(error) was called.
// The .catch() handler gets triggered.

// Need : used to handel asynchronous operations

//  Benefits:
// 	 Improved code readability and maintainability by handling asynchronous operations asynchronously.
// 	 Chaining of asynchronous operations for a more fluid flow.
// 	 Error handling for potential issues during asynchronous execution.

fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // Process the data
  })
  .catch((error) => {
    console.error(error);
    // Handle errors
  });

//   promise chaning

// the process of executing a sequence of asynchronous tasks one after another using promise

// .then(){}
// .then(){}
// .then(){}
