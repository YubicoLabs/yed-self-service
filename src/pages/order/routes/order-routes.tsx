import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
} from "react-router-dom";

import Delivery from "../components/delivery/delivery";
import AddressValidate from "../components/address-validate/address-validate"
import Confirmation from  "../components/confirmation/confirmation"
import { OrderHistory } from "../components/order-history/order-history";

import { OrderRoutePath } from "./order-route-path";
export default function OrderRoutes() {
  let { path } = useRouteMatch();
  return (
    <BrowserRouter>
      <Switch>
        <Route path={path + OrderRoutePath.Delivery}>
          <Delivery />
        </Route>
        <Route path={path + OrderRoutePath.OrderHistory}>
          <OrderHistory />
        </Route>
        <Route path={path + OrderRoutePath.AddressValidate}>
          <AddressValidate />
        </Route>
        <Route path={path + OrderRoutePath.Confirmation}>
          <Confirmation />
        </Route>
        <Route exact path={path}>
          <Redirect to={path + OrderRoutePath.Delivery} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
