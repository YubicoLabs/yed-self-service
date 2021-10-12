import React from "react";
import { Link } from "react-router-dom";
import Inventory from "./Inventory";
import AddressInput from "./AddressInput";
import OrderVerify from "./OrderVerify";
import OrderSummary from "./OrderSummary";
import inventoryConfig from "../../inventory-config";

/**
 * Some notes for the code below
 * Order Stages =
 *    1 - Select Key
 *    2 - Input Address
 *    3 - Verify Information
 *    4 - Submitting Order
 *    5 - Order complete
 */

class OrderFlow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 1,
      selectedKey: {},
      userAddress: {},
      userDetails: {},
      submitReady: false,
      orderDetails: {}
    };
  }

  componentDidMount() {
    //Implement something here that will pull the user profile information for -
    //Recipient Name, First Name, Last Name, Telephone, Email
    this.setState({
      userDetails: {
        recipient_email: "c.salas@yubico.com",
        recipient_firstname: "Cody",
        recipient_lastname: "Salas",
        recipient_telephone: "123-123-1234",
        recipient: "Cody Salas",
      },
    });
  }

  inventoryCallback = (inventorySelection) => {
    this.setState({ selectedKey: inventorySelection, stage: 2 });
  };

  addressCallback = (addressSelection) => {
    this.setState({ userAddress: addressSelection, stage: 3 });
  };

  async submitShipment(event) {
    event.preventDefault();
    this.setState({
      stage: 4,
    });
    this.forceUpdate();
    const body = {
      channelpartner_id: 0,
      delivery_type: inventoryConfig.DeliveryTypeDefault,
      country_code_2: this.state.userAddress.country_code_2, //Required
      recipient: this.state.userDetails.recipient, //Required
      recipient_email: this.state.userDetails.recipient_email,
      recipient_firstname: this.state.userDetails.recipient_firstname,
      recipient_lastname: this.state.userDetails.recipient_lastname,
      recipient_telephone: this.state.userDetails.recipient_telephone,
      street_line1: this.state.userAddress.street_line1,
      street_line2: this.state.userAddress.street_line2,
      street_line3: this.state.userAddress.street_line3,
      city: this.state.userAddress.city, //Required
      region: this.state.userAddress.region,
      postal_code: this.state.userAddress.postal_code, //Required
      shipment_items: [
        //Required
        {
          product_id: this.state.selectedKey.product_id,
          inventory_product_id: this.state.selectedKey.product_id,
          shipment_product_quantity: inventoryConfig.QuantityDefault,
        },
      ],
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    const URL = process.env.REACT_APP_API_URL + "/order/create";
    await fetch(URL, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((response) => {
        this.setState({
          stage: 5,
          orderDetails: response
        });
      })
      .catch((error) => {
        console.log("Something failed");
      });
  }

  render() {
    let currentFlow = <p></p>;
    if (this.state.stage === 1) {
      currentFlow = (
        <Inventory parentCallback={this.inventoryCallback}></Inventory>
      );
    } else if (this.state.stage === 2) {
      currentFlow = (
        <AddressInput parentCallbackAddr={this.addressCallback}></AddressInput>
      );
    } else if (this.state.stage === 3) {
      currentFlow = (
        <div>
          <OrderVerify
            userAddress={this.state.userAddress}
            keySelection={this.state.selectedKey}
          ></OrderVerify>
          <button type="button" onClick={this.submitShipment.bind(this)}>
            Submit Order
          </button>
        </div>
      );
    } else if (this.state.stage === 4) {
      currentFlow = <h1>Loading</h1>;
    } else if (this.state.stage === 5) {
      currentFlow = (
          <div>
              <h3>Your Order is on the way</h3>
              <OrderSummary orderDetails={this.state.orderDetails}></OrderSummary>
          </div>
      );
    }
    return currentFlow;
  }
}

export default OrderFlow;
