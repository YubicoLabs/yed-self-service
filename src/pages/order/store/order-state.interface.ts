import { DeliveryFormValues } from "../components/delivery/delivery-form-values.interface";
import { KeyDefaultValues } from "../components/key-default/key-default-values.interface";

export interface OrderState {
  deliveryForm: DeliveryFormValues;
  keydefault: KeyDefaultValues;
}
