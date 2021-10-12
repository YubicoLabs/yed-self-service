import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../../../store/root-state.interface";
import { DeliveryFormValues } from "../components/delivery/delivery-form-values.interface";

import { OrderState } from "./order-state.interface";

const getOrderState = (state: RootState): OrderState => state.order;

const getDeliveryForm = createSelector(
  getOrderState,
  (orderState: OrderState): DeliveryFormValues => orderState?.deliveryForm
);

export const orderSelectors = {
  getOrderState,
  getDeliveryForm,
};
