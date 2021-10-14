import { RootState } from '../../../../store/root-state.interface';
import { orderSelectors } from '../../store/order.selectors';

const mapStateToProps = (state: RootState) => {
    return {
        deliveryForm: orderSelectors.getDeliveryForm(state)
    };
};

type mapStateToPropsType = ReturnType<typeof mapStateToProps>;

type ConfirmationProps = mapStateToPropsType & {};

export { mapStateToProps };
export type { ConfirmationProps }