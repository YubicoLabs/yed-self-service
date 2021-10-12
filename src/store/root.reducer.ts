import { combineReducers } from "@reduxjs/toolkit";

import { orderSlice } from "../pages/order/store/order.slice";

import { RootState } from "./root-state.interface";

export const rootReducer = combineReducers<RootState>({
  order: orderSlice.reducer,
});
