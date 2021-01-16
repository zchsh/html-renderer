//  Set up params
const id = "test";
const props = { customText: "My very special custom text!" };

//  Figure out the corresponding localhost URL
const params = new URLSearchParams({ id, ...props });
const baseUrl = "http://localhost:3000/api/render-react-template";
const fullUrl = baseUrl + "?" + params.toString();

// Log out the URL to visit
console.log("");
console.log(fullUrl);
console.log("");
