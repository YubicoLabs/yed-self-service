import React from "react"
import {
    Link
  } from 'react-router-dom'
import Inventory from "./Inventory";
import AddressInput from "./AddressInput";
import OrderVerify from "./OrderVerify"

/**
 * Some notes for the code below
 * Order Stages = 
 *    1 - Select Key
 *    2 - Input Address
 *    3 - Verify Information
 *    4 - Submitting Order
 */

class OrderFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 1,
            selectedKey: {},
            userAddress: {}
        };
    }

    inventoryCallback = (inventorySelection) => {
        this.setState({ selectedKey: inventorySelection, stage: 2 })
    }

    addressCallback = (addressSelection) => {
        this.setState({ userAddress: addressSelection, stage: 3})
    }

    render() {
        let currentFlow = <p></p>
        if(this.state.stage === 1) {
            currentFlow = <Inventory parentCallback = {this.inventoryCallback}></Inventory>
        } else if(this.state.stage === 2) {
            currentFlow = <AddressInput parentCallbackAddr = {this.addressCallback}></AddressInput>
        } else if(this.state.stage === 3) {
            currentFlow = <OrderVerify userAddress={this.state.userAddress} keySelection={this.state.selectedKey}></OrderVerify>
        }
        return currentFlow
    }
}

export default OrderFlow;