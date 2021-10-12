import { Dispatch } from "@reduxjs/toolkit";

import { RootState } from "../../../../store/root-state.interface";
import { orderSelectors } from "../../store/order.selectors";
import { orderSlice } from "../../store/order.slice";

import { DeliveryFormValues } from "./delivery-form-values.interface";

const mapStateToProps = (state: RootState) => {
  return {
    deliveryForm: orderSelectors.getDeliveryForm(state),
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
  };
};

type mapStateToPropsType = ReturnType<typeof mapStateToProps>;
type mapDispatchToPropsType = ReturnType<typeof mapDispatchToProps>;

type DeliveryFormProps = mapStateToPropsType & mapDispatchToPropsType;

export { mapStateToProps, mapDispatchToProps };
export type { DeliveryFormProps };
