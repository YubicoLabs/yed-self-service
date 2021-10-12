import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
} from "react-router-dom";

import Delivery from "../components/delivery/delivery";
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
        <Route exact path={path}>
          <Redirect to={path + OrderRoutePath.Delivery} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
