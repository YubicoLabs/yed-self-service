import { DeliveryFormValues } from "../components/delivery/delivery-form-values.interface";
import { KeyDefaultValues } from "../components/key-default/key-default-values.interface";

/**
 * Used to define the order state for objects that will be used across the flow
 * deliveryForm - Used to store information about the address of the user
 * keyDefault - Used to store information about the key that the user has selected
 * formAction - Will be used to determine if the form is being used to Edit or Create (can be expanded with other values)
 * editOrderId - Used to persist the shipment ID if the user is editing - Needed to call to YED API for PUT /shipments_exact
 * @interface
 */
export interface OrderState {
  deliveryForm: DeliveryFormValues;
  keydefault: KeyDefaultValues;
  formAction: string,
  editOrderId: string
}
