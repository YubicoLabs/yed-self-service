import React from "react";
import { Link } from "react-router-dom";
import inventoryConfig from "../../inventory-config";

class OrderSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderDetails: props.orderDetails,
    };
  }

  sendSelection(event, item) {
    this.props.parentCallback(item);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h4>Your item</h4>
        <table>
          <tbody>
            {this.state.orderDetails.shipment_items.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={inventoryConfig[item.product_name].imageLocation}
                  ></img>
                </td>
                <td>{item.product_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4>Shipping To</h4>
        <ul>
          <li>Street Line 1: {this.state.orderDetails.street_line1}</li>
          <li>Street Line 2: {this.state.orderDetails.street_line2}</li>
          <li>City: {this.state.orderDetails.city}</li>
          <li>Region: {this.state.orderDetails.region}</li>
          <li>Postal Code: {this.state.orderDetails.postal_code}</li>
          <li>Country: {this.state.orderDetails.country_code_2}</li>
        </ul>
        <br />
        <Link to="/">
          <button type="button">Return Home</button>
        </Link>
        <br />
        <Link to="/myorders">
          <button type="button">See my orders</button>
        </Link>
      </div>
    );
  }
}

export default OrderSummary;
