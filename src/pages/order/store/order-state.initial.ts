import { initialDevlieryFormValues } from "../components/delivery/delivery-form-values.initial";
import { initialKeyDefaultValues } from "../components/key-default/key-default-values.initial";

import { OrderState } from "./order-state.interface";

export const initialOrderState: OrderState = {
  deliveryForm: initialDevlieryFormValues,
  keydefault: initialKeyDefaultValues
};
