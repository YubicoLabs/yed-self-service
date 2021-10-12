import React from "react"
import {
    Link
  } from 'react-router-dom'

class Home extends React.Component {

    render() {
        return (
            <div>
                <h1>Welcome to the super special yubico promotion</h1>
                <h3>Click below to redeem your free yubikey</h3>
                <Link to="/order">
                    <button type="button">Free stuff here</button>
                </Link>
                <br />
                <h1>Already made your order? Click below to see your current items</h1>
                <Link to="/myorders">
                    <button type="button">See my orders</button>
                </Link>
            </div>
        )
    }
}

export default Home;