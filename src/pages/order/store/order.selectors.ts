import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../../../store/root-state.interface";
import { DeliveryFormValues } from "../components/delivery/delivery-form-values.interface";
import { KeyDefaultValues } from "../components/key-default/key-default-values.interface";

import { OrderState } from "./order-state.interface";

const getOrderState = (state: RootState): OrderState => state.order;

const getDeliveryForm = createSelector(
  getOrderState,
  (orderState: OrderState): DeliveryFormValues => orderState?.deliveryForm
);

const getKeyDefault = createSelector(
  getOrderState,
  (orderState: OrderState): KeyDefaultValues => orderState?.keydefault
);

const getFormAction = createSelector(
  getOrderState,
  (orderState: OrderState): string => orderState?.formAction
);

const getEditOrderId = createSelector(
  getOrderState,
  (orderState: OrderState): string => orderState?.editOrderId
);

export const orderSelectors = {
  getOrderState,
  getDeliveryForm,
  getKeyDefault,
  getFormAction,
  getEditOrderId
};
