/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["YED_API_TOKEN","YED_COOKIE"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
const aws = require("aws-sdk");
const axios = require("axios");

const YED_API_URL = process.env.YED_API_URL;
let YED_API_TOKEN;
let YED_COOKIE;
let API_HEADER;

/**
 * Function that calls to the YED Inventory API and returns the keys available in the inventory
 * @returns The full inventory belonging to your specific organization
 */
async function getInventoryKeys() {
  const res = await axios
    .get(`${YED_API_URL}/inventory`, {
      headers: API_HEADER,
    })
    .then(
      (response) => {
        return response.data;
      },
      (error) => {
        return error;
      }
    );
  return res;
}

/**
 * Gets the order details of a specific order by ID
 * @param {String} orderID - An ID that corresponds to a current order number in YED
 * @returns The order details belonging to the passed order ID
 */
async function getOrder(orderID) {
  const res = await axios
    .get(`${YED_API_URL}/shipments_exact/${orderID}`, {
      headers: API_HEADER,
    })
    .then((response) => {
      return response.data;
    })
    .catch(({ response }) => {
      return response.data;
    });
  return res;
}

/**
 * Creates a new order based on the parameters sent by a user
 * @param {Object} orderDetails - Object sent by the client containing details about the shipment to create
 * @returns An object with a summary of the order
 */
async function createOrder(orderDetails) {
  //TODO, may need to take in User Details in this method, or consider making a global variable on lambda call
  //TODO, create mechanism for abuse prevention

  const res = await axios
    .post(`${YED_API_URL}/shipments_exact`, orderDetails, {
      headers: API_HEADER,
    })
    .then((response) => {
      //TODO, create mechanism to write details to a DB
      return response.data;
    })
    .catch(({ response }) => {
      return response.data;
    });
  return res;
}

/**
 * Method to edit an existing order
 * @param {Object} orderDetails - Object containing the new order details to edit
 * @param {String} orderID - ID of the order to be edited
 * @returns An object containing the new shipment details
 */
async function editOrder(orderDetails, orderID) {
  const res = await axios .put(`${YED_API_URL}/shipments_exact/${orderID}`, orderDetails, {
    headers: API_HEADER
  })
  .then((response) => {
    return response.data;
  })
  .catch(({ response }) => {
    return response.data;
  });
  return res;
}

/**
 * Call to the YED API to delete an order
 * @param {String} orderID - ID of order to delete
 * @returns Message stating whether the deletion was completed or an error
 */
async function deleteOrder(orderID) {
  const res = await axios.delete(`${YED_API_URL}/shipments_exact/${orderID}`, {
    headers: API_HEADER
  })
  .then((response) => {
    return response.data;
  })
  .catch(({ response }) => {
    return response.data;
  });
  return res; 
}

/**
 * Function that calls to the YED API in order to verify if an address is a shippable address by YED
 * This method can be replaced with another address verification API if needed, but some rewrites below may be needed
 * @param {Object} userAddress - Object containing address components sent by a user (follows the object format in the YED API Docs)
 * @returns Object detailing if the address is correct or incorrect (expect a response code of 200 if valid, 400 otherwise)
 */
async function verifyAddress(userAddress) {
  const res = await axios
    .post(`${YED_API_URL}/validate-address`, userAddress, {
      headers: API_HEADER,
    })
    .then((response) => {
      return response.data;
    })
    .catch(({ response }) => {
      return response.data;
    });
  return res;
}

exports.handler = async (event) => {
  // TODO implement

  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["YED_API_TOKEN", "YED_COOKIE"].map(
        (secretName) => process.env[secretName]
      ),
      WithDecryption: true,
    })
    .promise();

  let body;
  let statusCode = 200;

  YED_API_TOKEN = Parameters[0]["Value"];
  YED_COOKIE = Parameters[1]["Value"]; //Yubico only value needed for bypassing proxy
  API_HEADER = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${YED_API_TOKEN}`,
    Cookie: YED_COOKIE,
  };

  const httpMethod = event["httpMethod"];
  const path = event["resource"];
  const operation = `${httpMethod} ${path}`;

  try {
    switch (operation) {
      case "GET /inventory":
        body = await getInventoryKeys();
        break;
      case "POST /address":
        const userAddress = event.body;
        body = await verifyAddress(userAddress);
        break;
      case "GET /order/{isbn}":
        const orderID = event.pathParameters.isbn;
        body = await getOrder(orderID);
        break;
      case "POST /order/{isbn}":
        const orderDetails = event.body;
        body = await createOrder(orderDetails);
        break;
      case "PUT /order/{isbn}":
        const editOrderDetails = event.body;
        const editOrderID = event.pathParameters.isbn;
        body = await editOrder(editOrderDetails, editOrderID);
        break;
      case "DELETE /order/{isbn}":
        const deleteOrderID = event.pathParameters.isbn;
        body = await deleteOrder(deleteOrderID);
        break;
      case "GET /orders":
        //Will implement once we figure out our data storage decision 
        //The primary reason for this method is to retrieve all orders belonging to a user
        body = operation;
        break;
        case "GET /orderTest":
          //Will implement once we figure out our data storage decision 
          //The primary reason for this method is to retrieve all orders belonging to a user
          console.log(event);
          body = operation;
          break;
      default:
        body = operation;
        break;
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    },
    body: body,
  };
  return response;
};
