import { Dispatch } from '@reduxjs/toolkit';

import { RootState } from '../../../../store/root-state.interface';
import { orderSelectors } from '../../store/order.selectors';
import { orderSlice } from '../../store/order.slice';

import { KeyDefaultValues } from './key-default-values.interface';

const mapStateToProps = (state: RootState) => {
  return {
    defaultKey: orderSelectors.getKeyDefault(state),
    formAction: orderSelectors.getFormAction(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    submitKeyDefault(values: KeyDefaultValues) {
      dispatch(orderSlice.actions.submitKeyDefault(values));
    },
    clearKeyDefault() {
      dispatch(orderSlice.actions.clearKeyDefault());
    },
    submitFormAction(values: string) {
      dispatch(orderSlice.actions.submitFormAction(values));
    },
  };
};

type mapStateToPropsType = ReturnType<typeof mapStateToProps>;
type mapDispatchToPropsType = ReturnType<typeof mapDispatchToProps>;

type KeyDefaultProps = mapStateToPropsType & mapDispatchToPropsType;

export { mapStateToProps, mapDispatchToProps };
export type { KeyDefaultProps };
