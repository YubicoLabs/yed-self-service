import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
} from 'react-router-dom';

import KeyDefault from '../components/key-default/key-default';
import Delivery from '../components/delivery/delivery';
import Confirmation from '../components/confirmation/confirmation';
import OrderHistory from '../components/order-history/order-history';

import { OrderRoutePath } from './order-route-path';
export default function OrderRoutes() {
  let { path } = useRouteMatch();
  return (
    <BrowserRouter>
      <Switch>
        <Route path={path + OrderRoutePath.Delivery + '/:action/:id'}>
          <Delivery />
        </Route>
        <Route path={path + OrderRoutePath.Delivery}>
          <Delivery />
        </Route>
        <Route path={path + OrderRoutePath.OrderHistory}>
          <OrderHistory />
        </Route>
        <Route path={path + OrderRoutePath.Confirmation + '/:action/:id'}>
          <Confirmation />
        </Route>
        <Route path={path + OrderRoutePath.Confirmation}>
          <Confirmation />
        </Route>
        <Route path={path + OrderRoutePath.KeyDefault}>
          <KeyDefault />
        </Route>
        <Route exact path={path}>
          <Redirect to={path + OrderRoutePath.KeyDefault} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
