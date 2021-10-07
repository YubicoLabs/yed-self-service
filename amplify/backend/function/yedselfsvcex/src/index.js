const aws = require('aws-sdk');
const axios = require('axios');

const YED_API_URL = process.env.YED_API_URL;
let YED_API_TOKEN;
let YED_COOKIE;
let API_HEADER;

/**
 * TODO
 * Function that calls to the YED Inventory API and returns the keys available in the inventory
 * Configuration can be done in the model above to create custom descriptions for the keys to be used in your UI
 * @param - N/A
 * @returns - List of objects containing specific information about the keys
 */
 async function getInventoryKeys() {
    const res = await axios.get(`${YED_API_URL}/inventory`, {
        headers: API_HEADER
    }).then((response) => {
        return response.data;
    }, (error) => {
        return error
    });
    return res;
 }

 /**
 * TODO
 * Function that calls to the YED API in order to verify if an address is a shippable address by YED
 * This method can be replaced with another address verification API if needed, but some rewrites below may be needed
 * @param, - Address entered by the user - The body to the lambda API should match the schema in the YED API Documentation
 * @returns - True if the address is valid, false otherwise (this may be extended to include recommendations in a later release)
 */
async function verifyAddress(userAddress) {
    const res = await axios.post(
        `${YED_API_URL}/validate-address`, 
        userAddress,
        {
            headers: API_HEADER
        }
    ).then((response) => {
        return response.data;
    })
    .catch(({ response }) => {
        return response.data;
    });
    return res;
}

/**
 * This is your main logic of the lambda function
 */
exports.handler = async (event) => {
  // TODO implement

  const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["YED_API_TOKEN","YED_COOKIE"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  YED_API_TOKEN = Parameters[0]['Value'];
  YED_COOKIE = Parameters[1]['Value']; //Yubico only value needed for bypassing proxy
  API_HEADER = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${YED_API_TOKEN}`,
      "Cookie": YED_COOKIE
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
        body = operation;
        break;
      case "GET /order/{isbn}":
        body = operation;
        break;
      case "POST /order/{isbn}":
        body = operation;
        break;
      case "PUT /order/{isbn}":
        body = operation;
        break;
      case "DELETE /order/{isbn}":
        body = operation;
        break;
      case "GET /orders":
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
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: body,
    headers: headers,
  };
  return response;
};
