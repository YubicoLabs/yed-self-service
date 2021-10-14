import React, { FunctionComponent, useState } from 'react';
import { Typography, CircularProgress, Button, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { AddressFormValues } from '../address/address-form-values.interface';
import { OrderStepper } from '../order-stepper/order-stepper';
import {
  AddressValidateProps,
  mapStateToProps,
} from './address-validate.props';
import { Message } from './address-validate-values-interface';
import { AppRoutePath } from '../../../../routes/app-route-path';
import { OrderRoutePath } from '../../routes/order-route-path';
import { useHistory } from 'react-router';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

let VerifyAddress = async (address: AddressFormValues): Promise<any> => {
  const body = {
    street_line1: address.addressLine1,
    street_line2: address.addressLine2,
    city: address.city,
    postal_code: address.zipPostalCode,
    region: address.provinceState,
    country_code_2: address.country,
  };
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
  const URL = `${process.env.REACT_APP_API_URL}/address`;
  return await fetch(URL, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'undeliverable') {
        return {
          called: true,
          isValid: false,
          message: data.details,
        };
      } else if (data.status === 'deliverable') {
        return {
          called: true,
          isValid: true,
          message: '',
        };
      }
    });
};

export const AddressValidate: FunctionComponent<AddressValidateProps> = ({
  deliveryForm,
}) => {
  const [called, setCalled] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState([{ description: '' }]);

  const { t } = useTranslation();
  const history = useHistory();
  if (!called) {
    VerifyAddress(deliveryForm.shippingAddress).then((res) => {
      if (res === undefined) {
        setCalled(true);
        setIsValid(false);
        setMessage([]);
        return;
      }
      setCalled(res.called);
      setIsValid(res.isValid);
      setMessage(res.message);
    });
  }
  const submitForm = () => {
    history.push(AppRoutePath.Order + OrderRoutePath.Confirmation);
  };
  const goBack = () => {
    history.push(AppRoutePath.Order + OrderRoutePath.Delivery);
  };
  return (
    <>
      <OrderStepper />
      <Formik
        enableReinitialize={true}
        initialValues={deliveryForm}
        onSubmit={submitForm}>
        <Box textAlign='right' mt={2}>
          {!called && (
            <>
              <CircularProgress />
              <Typography variant='h6' gutterBottom>
                {t('address-validate.loading')}
              </Typography>
            </>
          )}
          {isValid && (
            <>
              <Typography variant='h6' gutterBottom>
                {t('address-validate.success')}
              </Typography>
              <Button
                type='button'
                variant='contained'
                color='secondary'
                endIcon={<ArrowBackIcon />}
                size='large'
                onClick={goBack}>
                {t('order.previous')}
              </Button>
              <Button
                type='button'
                variant='contained'
                color='primary'
                endIcon={<ArrowRightAltIcon />}
                size='large'
                onClick={submitForm}>
                {t('order.continue')}
              </Button>
            </>
          )}
          {called && !isValid && (
            <>
              <Typography variant='h6' gutterBottom>
                {t('address-validate.error')}
              </Typography>
              {message.map(function (item: Message, index) {
                return (
                  <Typography variant='h6' gutterBottom key={index}>
                    {item.description}
                  </Typography>
                );
              })}
              <Button
                type='button'
                variant='contained'
                color='secondary'
                endIcon={<ArrowBackIcon />}
                size='large'
                onClick={goBack}>
                {t('order.previous')}
              </Button>
            </>
          )}
        </Box>
      </Formik>
    </>
  );
};

export default connect(mapStateToProps)(AddressValidate);
