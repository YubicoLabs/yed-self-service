import { Dispatch } from "@reduxjs/toolkit";

import { RootState } from "../../../../store/root-state.interface";
import { orderSelectors } from "../../store/order.selectors";
import { orderSlice } from "../../store/order.slice";

import { DeliveryFormValues } from "./delivery-form-values.interface";
import { KeyDefaultValues } from '../key-default/key-default-values.interface';

const mapStateToProps = (state: RootState) => {
  return {
    deliveryForm: orderSelectors.getDeliveryForm(state),
    keyDefault: orderSelectors.getKeyDefault(state),
    formAction: orderSelectors.getFormAction(state),
    editOrderId: orderSelectors.getEditOrderId(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submitDeliveryForm(formValues: DeliveryFormValues) {
      dispatch(orderSlice.actions.submitDeliveryForm(formValues));
    },
    clearDeliveryForm() {
      dispatch(orderSlice.actions.clearDeliveryForm());
    },
    submitKeyDefault(values: KeyDefaultValues) {
      dispatch(orderSlice.actions.submitKeyDefault(values));
    },
    clearKeyDefault() {
      dispatch(orderSlice.actions.clearKeyDefault());
    },
    submitFormAction(values: string) {
      dispatch(orderSlice.actions.submitFormAction(values));
    },
    clearFormActions() {
      dispatch(orderSlice.actions.clearKeyDefault());
    },
    submitEditOrderId(values: string) {
      dispatch(orderSlice.actions.submitEditOrderId(values));
    },
    clearEditOrderId() {
      dispatch(orderSlice.actions.clearEditOrderId());
    },
  };
};

type mapStateToPropsType = ReturnType<typeof mapStateToProps>;
type mapDispatchToPropsType = ReturnType<typeof mapDispatchToProps>;

type DeliveryFormProps = mapStateToPropsType & mapDispatchToPropsType;

export { mapStateToProps, mapDispatchToProps };
export type { DeliveryFormProps };
