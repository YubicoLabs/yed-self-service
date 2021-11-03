import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DeliveryFormValues } from "../components/delivery/delivery-form-values.interface";
import { KeyDefaultValues } from "../components/key-default/key-default-values.interface";

import { initialOrderState } from "./order-state.initial";
import { OrderState } from "./order-state.interface";

export const orderSlice = createSlice({
  name: "order",
  initialState: initialOrderState,
  reducers: {
    submitDeliveryForm(
      state: OrderState,
      action: PayloadAction<DeliveryFormValues>
    ) {
      state.deliveryForm = action.payload;
    },
    clearDeliveryForm(state: OrderState) {
      state.deliveryForm = initialOrderState.deliveryForm;
    },
    submitKeyDefault(
      state: OrderState,
      action: PayloadAction<KeyDefaultValues>
    ) {
      state.keydefault = action.payload;
    },
    clearKeyDefault(state: OrderState) {
      state.keydefault = initialOrderState.keydefault
    },
    submitFormAction(
      state: OrderState,
      action: PayloadAction<string>
    ) {
      state.formAction = action.payload;
    },
    clearFormAction(state: OrderState) {
      state.formAction = 'create'
    },
    submitEditOrderId(
      state: OrderState,
      action: PayloadAction<string>
    ) {
      state.editOrderId = action.payload;
    },
    clearEditOrderId(state: OrderState) {
      state.editOrderId = ''
    }
  },
});
