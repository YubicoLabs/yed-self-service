//Ensure the names in this config file match the names of the product in the inventory
//Information on inventory type can be found here, https://console.yubico.com/help/api-req.html
//Use the array below to select the inventory types you want shown to your users
//QuantityDefault used in case the application should default the quantity of the order, otherwise set to -1
const inventoryConfig = {
    "YubiKey 5 Nano": {
        "imageLocation": "../images/5Nano.png",
        "customDescription": "Custom desc for 5 Nano"
    },
    "YubiKey 5Ci": {
        "imageLocation": "../images/5CI.png",
        "customDescription": "Custom desc for 5CI"
    },
    "YubiKey 5 NFC": {
        "imageLocation": "../images/5NFC.png",
        "customDescription": "Custom desc for 5NFC"
    },
    "YubiKey 5C": {
        "imageLocation": "../images/5C.png",
        "customDescription": "Custom desc for 5C"
    },
    "InventoryType": [ 1 ],
    "QuantityDefault": 2
}

export default inventoryConfig;