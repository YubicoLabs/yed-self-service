import { AddressFormValues } from "../address/address-form-values.interface";

export interface DeliveryFormValues {
  shippingAddress: AddressFormValues;
}

export interface Message {
  description: string;
}

export interface AddressResponse {
  deliverable: boolean,
  called: boolean,
  isValid: boolean,
  message: [Message]
}