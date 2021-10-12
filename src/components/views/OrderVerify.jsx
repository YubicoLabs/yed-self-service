import React from "react"

class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: props.userAddress,
            keySelection: props.keySelection
        };
    }
    
    render() {
        let display = <p>Loading Order</p>
        if(this.state.address === undefined || this.state.address === undefined) {
            display = <p>Something went wrong, try again</p>
        } else {
            display = (
                <div>
                <h3>Here is your order summary</h3>
                <br />
                <h4>Your item</h4>
                <table>
                <tbody>
                        <tr>
                            <td><img src={this.state.keySelection.inventoryConfig.imageLocation}></img></td>
                            <td>{this.state.keySelection.product_name}</td>
                            <td>{this.state.keySelection.inventoryConfig.customDescription}</td>
                        </tr>
                </tbody>
            </table>
            <br />
            <h4>Your address</h4>
            <ul>
                <li>Street Line 1: {this.state.address.street_line1}</li>
                <li>Street Line 2: {this.state.address.street_line2}</li>
                <li>Street Line 3: {this.state.address.street_line3}</li>
                <li>City: {this.state.address.city}</li>
                <li>Region: {this.state.address.region}</li>
                <li>Postal Code: {this.state.postal_code}</li>
                <li>Country: {this.state.address.country_code_2}</li>
            </ul>
            </div>
            )
        }
        return display
    }
}

export default Inventory;