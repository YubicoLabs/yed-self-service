const aws = require('aws-sdk');
const axios = require('axios');

const YED_API_URL = "https://api.console.stage.yubico.com/v1";

exports.handler = async (event, context) => {
    console.log("Entered Handler");
    const fullInvList = await getInventory();
    const lowInvList = determineLowInv(fullInvList.organization_product_inventory);
    const message = formatMessage(lowInvList);
    await publishMessage(message);
    console.log("Exiting Handler");
};

function determineLowInv(invList) {
    console.log("determineLowInv, Analyzing current inventory", invList);
    const INV_THRESHOLD = parseInt(process.env.INV_THRESHOLD);
    let lowInvArray = [];
    for(let i = 0; i < invList.length; i++) {
        if(invList[i].organization_product_quantity < INV_THRESHOLD) {
            const lowInvString = invList[i].product_name + ": remaining inventory - " + invList[i].organization_product_quantity;
            lowInvArray.push(lowInvString);
        }
    }
    console.log("determineLowInv, Low Inventory Array: ", lowInvArray);
    return lowInvArray;
}

function formatMessage(lowInvList) {
    console.log("formatMessage, entering method with list: ", lowInvList);
    var messageToSend = "Hello,\nThis is your daily low quantity alert for your YubiEnterprise inventory\n\n";
    if(lowInvList.length === 0) {
        console.log("formatMessage, No items with low inventory");
        messageToSend = "Congrats! Your inventory is sufficiently stocked";
    } else {
        console.log("formatMessage, Formatting items with low inventory");
        messageToSend += "The following items have been analyzed as having a low inventory quantity:\n"
        for(let i = 0; i < lowInvList.length; i++) {
            messageToSend += lowInvList[i] + "\n"
        }
        messageToSend += "\nPlease contact your Yubico representative if you desire to refill your YubiKey inventory.\n"
    }
    console.log("formatMessage, Message formatted as: ", messageToSend);
    return messageToSend;
}

async function publishMessage(message) {
    console.log("publishMessage, Preparing to send message, ", message);
    var sns = new aws.SNS();
    var params = {
        Message: message,
        TopicArn: "arn:aws:sns:us-east-1:764504484168:inv-monitor"
    };
    var snsPromise = sns.publish(params).promise();
    await snsPromise.then((data) => {
        console.log("publishMessage, Message sent successfully with data: ", data);
    })
    .catch((err) => {
        console.error("publishMessage, error in sending message to sns: ", err);
    });
}

async function getInventory() {
    console.log("getInventory, Getting YED inventory");
    const API_HEADER = await formatHeader();
    const res = await axios
    .get(`${YED_API_URL}/inventory`, {
        headers: API_HEADER,
    })
    .then(
        (response) => {
        return response.data;
        },
        (error) => {
        console.error(error);
        return error;
        }
    );
    console.log("getInventory, GET /inventory response: ", res);
    return res;
}

async function formatHeader() {
    console.log("formatHeader, Formatting HTTP header");
    const { Parameters } = await (new aws.SSM())
    .getParameters({
      Names: ["YED_API_TOKEN","YED_API_COOKIE"].map(secretName => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();

    const YED_API_COOKIE = Parameters[0]['Value'];
    const YED_API_TOKEN = Parameters[1]['Value']; //Yubico only value needed for bypassing proxy

    const API_HEADER = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${YED_API_TOKEN}`,
        Cookie: YED_API_COOKIE,
    }

    return API_HEADER;
}