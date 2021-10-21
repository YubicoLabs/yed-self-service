/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_YEDSELFSVCDB_ARN
	STORAGE_YEDSELFSVCDB_NAME
	STORAGE_YEDSELFSVCDB_STREAMARN
Amplify Params - DO NOT EDIT */
const aws = require('aws-sdk');
const axios = require('axios');
const { errorMonitor } = require('events');

const docClient = new aws.DynamoDB.DocumentClient();
const YED_API_URL = process.env.YED_API_URL;
const DEFAULT_PRODUCT_ID = process.env.DEFAULT_PRODUCT_ID;
const TABLE_NAME = process.env.STORAGE_YEDSELFSVCDB_NAME;
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
 * Allows the application owner to set configurations to set a default key to be redeemed by all users
 * @returns The product Obj of the specified default product key
 */
async function getDefaultKey() {
  const res = await axios
    .get(`${YED_API_URL}/products/${DEFAULT_PRODUCT_ID}`, {
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
async function createOrder(orderDetails, userId) {
  //Create Order
  const res = await axios
    .post(`${YED_API_URL}/shipments_exact`, orderDetails, {
      headers: API_HEADER,
    })
    .then((response) => {
      //If successful add to the DB
      try {
        writeShipmentToDB(response.data.shipment_id, userId);
        return response.data;
      } catch (err) {
        return error;
      }
    })
    .catch((error) => {
      return error;
    });
  return res;
}

/**
 * Use to write a new order to the database
 * @param {string} shipmentId ID of the shipment to store in the DB
 * @param {string} userId ID of the user to associate the order to
 * @returns nothing if successful, or an error if the DB insert was unsuccessful
 */
async function writeShipmentToDB(shipmentId, userId) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      user_sub: userId,
      shipment_id: shipmentId,
    },
  };

  try {
    await docClient.put(params).promise();
  } catch (err) {
    return err;
  }
}

async function deleteShipmentFromDB(shipment_id) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      shipment_id: shipment_id
    }
  };

  try {
    await docClient.delete(params).promise();
  } catch (err) {
    return err;
  }
}

/**
 * Method to edit an existing order
 * @param {Object} orderDetails - Object containing the new order details to edit
 * @param {String} orderID - ID of the order to be edited
 * @returns An object containing the new shipment details
 */
async function editOrder(orderDetails, orderID) {
  const res = await axios
    .put(`${YED_API_URL}/shipments_exact/${orderID}`, orderDetails, {
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
 * Call to the YED API to delete an order
 * @param {String} orderID - ID of order to delete
 * @returns Message stating whether the deletion was completed or an error
 */
async function deleteOrder(orderID) {
  const res = await axios
    .delete(`${YED_API_URL}/shipments_exact/${orderID}`, {
      headers: API_HEADER,
    })
    .then((response) => {
      deleteShipmentFromDB(orderID);
      return response.data;
    })
    .catch((err) => {
      return err;
    });

  return res;
}

/*
async function getOrders(userSub) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: '#user = :sub',
    ExpressionAttributeNames: {
      '#user': 'user_sub',
    },
    ExpressionAttributeValues: {
      ':sub': userSub,
    },
  };

  let dynamoRes = {};
  try {
    dynamoRes = await docClient.scan(params).promise();
  } catch (err) {
    return err;
  }

  const shipmentIds = dynamoRes.Items;
  if (shipmentIds.length === 0) {
    return {
      count: 0,
      shipments: [],
    };
  }
  let queryString = '';
  shipmentIds.forEach((item) => {
    queryString += `search=${item.shipment_id}&`;
  });
  queryString += 'search_field=shipment_id';

  const res = await axios
    .get(`${YED_API_URL}/shipments_exact?${queryString}`, {
      headers: API_HEADER,
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
  return res;
}
*/

async function getOrders(userSub) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: '#user = :sub',
    ExpressionAttributeNames: {
      '#user': 'user_sub',
    },
    ExpressionAttributeValues: {
      ':sub': userSub,
    },
  };

  let dynamoRes = {};
  try {
    dynamoRes = await docClient.scan(params).promise();
  } catch (err) {
    return err;
  }

  const shipmentIds = dynamoRes.Items;
  if (shipmentIds.length === 0) {
    return {
      count: 0,
      shipments: [],
    };
  }

  const promises = shipmentIds.map(item => {
    return axios
    .get(`${YED_API_URL}/shipments_exact/${item.shipment_id}`, {
      headers: API_HEADER,
    })
    .then((response) => {
      return response.data;
    })
    .catch(({ response }) => {
      return response.data;
    });
  });
  const value = Promise.all(promises).then((data) => {
    return data
  });

  return value;
}

async function getAllOrders() {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await docClient.scan(params).promise();
    return {
      data: data,
    };
  } catch (err) {
    return err;
  }
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
      Names: ['YED_API_TOKEN', 'YED_COOKIE'].map(
        (secretName) => process.env[secretName]
      ),
      WithDecryption: true,
    })
    .promise();

  let body;
  let statusCode = 200;

  YED_API_TOKEN = Parameters[0]['Value'];
  YED_COOKIE = Parameters[1]['Value']; //Yubico only value needed for bypassing proxy
  API_HEADER = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${YED_API_TOKEN}`,
    Cookie: YED_COOKIE,
  };

  const httpMethod = event['httpMethod'];
  const path = event['resource'];
  const operation = `${httpMethod} ${path}`;

  try {
    var sub = event.requestContext.authorizer
      ? event.requestContext.authorizer.claims.sub
      : undefined;

    switch (operation) {
      case 'GET /inventory':
        body = await getInventoryKeys();
        break;
      case 'GET /defaultinventory':
        body = await getDefaultKey();
        break;
      case 'POST /address':
        const userAddress = event.body;
        body = await verifyAddress(userAddress);
        break;
      case 'GET /order/{isbn}':
        const orderID = event.pathParameters.isbn;
        body = await getOrder(orderID);
        break;
      case 'POST /order/{isbn}':
        const orderDetails = event.body;
        body = await createOrder(orderDetails, sub);
        break;
      case 'PUT /order/{isbn}':
        const editOrderDetails = event.body;
        const editOrderID = event.pathParameters.isbn;
        body = await editOrder(editOrderDetails, editOrderID);
        break;
      case 'DELETE /order/{isbn}':
        const deleteOrderID = event.pathParameters.isbn;
        body = await deleteOrder(deleteOrderID);
        break;
      case 'GET /orders':
        //Will implement once we figure out our data storage decision
        //The primary reason for this method is to retrieve all orders belonging to a user
        body = await getOrders(sub);
        break;
      case 'GET /allorders':
        //Will implement once we figure out our data storage decision
        //The primary reason for this method is to retrieve all orders belonging to a user
        body = await getAllOrders();
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
    },
    body: body,
  };
  return response;
};
