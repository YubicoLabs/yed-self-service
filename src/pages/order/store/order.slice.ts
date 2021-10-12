import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DeliveryFormValues } from "../components/delivery/delivery-form-values.interface";

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
  },
});
