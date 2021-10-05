const AWS = require("aws-sdk");

/**
 * TODO
 * Function to make a request to the AWS Secrets Manager to pull in the YED secret for operations
 * @param - N/A
 * @returns API Secret for the YED API
 */
function getSecret() {};

/**
 * TODO
 * Function to validate a jwt token for user operation/details
 * @param - token that was received when making the request
 * @returns - Object with user details pulled from the token
 */
 function validateJWT() {};

/**
 * TODO
 * Function that calls to the YED Inventory API and returns the keys available in the inventory
 * Configuration can be done in the model above to create custom descriptions for the keys to be used in your UI
 * @param - N/A
 * @returns - List of objects containing specific information about the keys
 */
function getInventoryKeys(){};

/**
 * TODO
 * Function that calls to the YED API in order to verify if an address is a shippable address by YED
 * This method can be replaced with another address verification API if needed, but some rewrites below may be needed
 * @param, - Address entered by the user
 * @returns - True if the address is valid, false otherwise (this may be extended to include recommendations in a later release)
 */
function verifyAddress(userAddress){};

/**
 * TODO
 * Function to return detailed information about a specific order
 * @param - ID of the oder
 * @returns - Object containing details about an order 
 */
function getOrder(orderID){};

/**
 * Will return a collection of orders (if the user is able to have multiple orders) - Otherwise it will be a one item collection
 * @param - ID of the user
 * @returns - Collection of orders belonging to the user
 */
function getOrders(userID){};

/**
 * Allows a user to create a new order
 * @param - Details of the shipment to POST to YED
 * @returns - Standard YED response object with order details
 */
 function createOrder(shipmentDetails){}

/**
 * Allows a user to edit a specific order
 * @param - ID of the order to change, and the details needed to update the order
 * @returns - Standard YED response object with order details
 */
function editOrder(orderID, shipmentChanges){}

/**
 * Allows a user to delete a specific order
 * @param - ID of the order to delete
 * @returns - Confirmation message that the item was deleted
 */
 function deleteOrder(orderID){}

exports.handler = async (event) => {
    // TODO implement
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };


    try {
        switch (event.routeKey) {

        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};
