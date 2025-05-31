// Scenario:
// We have a generic delivery function that logs the delivery details.
// Multiple restaurants want to use this function but with their own names and locations.

// All three are used to explicitly set the value of this when calling a function.

function deliver(order, time) {
  console.log(`${this.restaurant} will deliver ${order} at ${time} from ${this.location}.`);
}

// call()
// The call() method calls a function with a given this value and arguments provided individually.

const mcd = { restaurant: "McDonald's", location: "MG Road" };
deliver.call(mcd, "Burger", "6:00 PM");

// The apply() method calls a function with a given this value, but arguments are passed as an array.

const dominos = { restaurant: "Domino's", location: "FC Road" };
deliver.apply(dominos, ["Pizza", "7:00 PM"]);

// The bind() method creates a new function that, when called, has its this keyword set
// to the provided value, with optional arguments pre-filled.
const subway = { restaurant: "Subway", location: "JM Road" };
const subwayDelivery = deliver.bind(subway);

subwayDelivery("Sub", "5:30 PM");
