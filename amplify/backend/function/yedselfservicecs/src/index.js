const aws = require("aws-sdk");

/**
 * Amplify generated way to receive tokens
 */
const { Parameters } = await new aws.SSM()
  .getParameters({
    Names: ["yedtoken", "yedcookie"].map(
      (secretName) => process.env[secretName]
    ),
    WithDecryption: true,
  })
  .promise();

/**
 * Set ENV variable for your YED API URL
 */
const yed_url = process.env.yedurl;

/**
 * TODO
 * Function to validate a jwt token for user operation/details
 * @param - token that was received when making the request
 * @returns - Object with user details pulled from the token
 */
function validateJWT() {}

/**
 * TODO
 * Function that calls to the YED Inventory API and returns the keys available in the inventory
 * Configuration can be done in the model above to create custom descriptions for the keys to be used in your UI
 * @param - N/A
 * @returns - List of objects containing specific information about the keys
 */
function getInventoryKeys() {}

/**
 * TODO
 * Function that calls to the YED API in order to verify if an address is a shippable address by YED
 * This method can be replaced with another address verification API if needed, but some rewrites below may be needed
 * @param, - Address entered by the user
 * @returns - True if the address is valid, false otherwise (this may be extended to include recommendations in a later release)
 */
function verifyAddress(userAddress) {}

/**
 * TODO
 * Function to return detailed information about a specific order
 * @param - ID of the oder
 * @returns - Object containing details about an order
 */
function getOrder(orderID) {}

/**
 * Will return a collection of orders (if the user is able to have multiple orders) - Otherwise it will be a one item collection
 * @param - ID of the user
 * @returns - Collection of orders belonging to the user
 */
function getOrders(userID) {}

/**
 * Allows a user to create a new order
 * @param - Details of the shipment to POST to YED
 * @returns - Standard YED response object with order details
 */
function createOrder(shipmentDetails) {}

/**
 * Allows a user to edit a specific order
 * @param - ID of the order to change, and the details needed to update the order
 * @returns - Standard YED response object with order details
 */
function editOrder(orderID, shipmentChanges) {}

/**
 * Allows a user to delete a specific order
 * @param - ID of the order to delete
 * @returns - Confirmation message that the item was deleted
 */
function deleteOrder(orderID) {}

exports.handler = async (event) => {
  // TODO implement
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  /*
  try {
    switch (event.routeKey) {
      case "GET /yed/inventory":
            body = { "Message": "In the GET inventory method" }
        break;
      case "POST /yed/address":
        body = { "Message": "In the POST address" }
        break;
      case "GET /yed/order/{id}":
        body = { "Message": `In the GET order method with param  "${event.pathParameters.id}"`  }
        break;
      case "GET /yed/orders/{id}":
        body = { "Message": `In the GET orders method with param  "${event.pathParameters.id}"`  }
        break;
      case "POST /yed/order":
        body = { "Message": `In the POST order method`  }
        break;
      case "PUT /yed/order/{id}":
        body = { "Message": `In the PUT order method with param  "${event.pathParameters.id}"`  }
        break;
      case "DELETE /yed/order/{id}":
        body = { "Message": `In the DELETE orders method with param  "${event.pathParameters.id}"`  }
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }
  */

  body = {"message": "Hello World"}

  body = JSON.stringify(body);

  return {
    statusCode,
    body,
    headers,
  };
};
