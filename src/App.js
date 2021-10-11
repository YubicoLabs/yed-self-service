import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Inventory from "./components/views/Inventory";
import Home from "./components/views/Home";
import AddressInput from "./components/views/AddressInput";
import OrderFlow from "./components/views/OrderFlow";

function App() {
  //Auth.currentAuthenticatedUser().then((response) => console.log(response));
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/order">Order Flow</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/order">
            <OrderFlow></OrderFlow>
          </Route>
          <Route path="/">
            <Home></Home>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);
