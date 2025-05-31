// DOM stands for Document Object Model. It's a programming interface provided by the browser
// that allows JavaScript to interact with and manipulate HTML and XML documents.

// In simple terms:
// The browser converts your HTML document into a tree-like structure (nodes and objects).
// JavaScript can use the DOM to change content, add/remove elements, style elements, or respond to events.

// <!DOCTYPE html>
// <html>
//   <body>
//     <h1 id="heading">Hello DOM!</h1>
//     <button onclick="changeText()">Click Me</button>

//     <script>
//       function changeText() {
//         const heading = document.getElementById("heading");
//         heading.textContent = "You clicked the button!";
//       }
//     </script>
//   </body>
// </html>

// DOM Selection Methods

// 1. document.getElementById()
// Selects a single HTML element using its unique ID.
document.getElementById("idName");

// Returns:
// A single Element object, or null if not found.

const title = document.getElementById("main-title");

// 2. document.getElementsByClassName()
// Selects all elements that share a common class name.

document.getElementsByClassName("className");
// Returns:
// An HTMLCollection (live, array-like list of elements).

const cards = document.getElementsByClassName("card");

// 3. document.getElementsByTagName()
// Definition:
// Selects all elements with a given HTML tag name.

document.getElementsByTagName("tagName");

// Returns:
// An HTMLCollection.

const paragraphs = document.getElementsByTagName("p");

// 4. document.querySelector()
// Definition:
// Returns the first element that matches a given CSS selector.

// Returns:
// A single Element object, or null.

const firstCard = document.querySelector(".card");
const main = document.querySelector("#main");

// 5. document.querySelectorAll()
// Definition:
// Returns all elements that match a given CSS selector.

// document.querySelectorAll("selector")
// Returns:
// A NodeList (static, array-like list of elements).

const allCards = document.querySelectorAll(".card");
