import { RootState } from '../../../../store/root-state.interface';
import { orderSelectors } from '../../store/order.selectors';

const mapStateToProps = (state: RootState) => {
    return {
        deliveryForm: orderSelectors.getDeliveryForm(state)
    };
};

type mapStateToPropsType = ReturnType<typeof mapStateToProps>;

type AddressValidateProps = mapStateToPropsType & {};

export { mapStateToProps };
export type { AddressValidateProps }