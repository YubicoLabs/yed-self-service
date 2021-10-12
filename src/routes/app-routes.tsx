import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { Order } from "../pages/order/order";

import { AppRoutePath } from "./app-route-path";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={AppRoutePath.Order}>
          <Order />
        </Route>
        <Route exact path="/">
          <Redirect to={AppRoutePath.Order} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
