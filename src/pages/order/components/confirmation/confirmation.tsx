import React, { FunctionComponent } from 'react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { AddressFormValues } from '../address/address-form-values.interface'; 
import { OrderStepper } from '../order-stepper/order-stepper';

import { ConfirmationProps, mapStateToProps } from './confirmation.props'

const AddressDisplay: FunctionComponent<{ address: AddressFormValues }> = ({
    address,
}) => {
    return (
        <>
            {address.firstName} {address.lastName} <br />
            {address.addressLine1} <br />
            {address.addressLine2 && (
                <>
                    {address.addressLine2} <br/>
                </>
            )}
            {address.city}, {address.provinceState}, {address.country}{' '}
            {address.zipPostalCode}
        </>
    );
};

export const Confirmation: FunctionComponent<ConfirmationProps> = ({
    deliveryForm
}) => {
    const { t } = useTranslation();
    return (
    <>
    <OrderStepper />
    <Typography variant="h3" gutterBottom>
        {t('checkout.delivery')}
    </Typography>
    <Typography variant="h6" gutterBottom>
        {t('checkout.shippingAddress')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <AddressDisplay address={deliveryForm.shippingAddress} />
      </Typography>
    </>
    )
};

export default connect(mapStateToProps)(Confirmation);