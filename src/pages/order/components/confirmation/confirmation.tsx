import React, { FunctionComponent, useState, useEffect } from 'react';
import { Typography, Button, CircularProgress } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import invConfig from '../../../../inv-config';
import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import { CardContent, CardMedia } from '@mui/material';

import { AddressFormValues } from '../address/address-form-values.interface';
import { KeyDefaultValues } from '../key-default/key-default-values.interface';

import { OrderStepper } from '../order-stepper/order-stepper';

import { ConfirmationProps, mapStateToProps } from './confirmation.props';
import { AppRoutePath } from '../../../../routes/app-route-path';
import { OrderRoutePath } from '../../routes/order-route-path';
import { useHistory } from 'react-router-dom';

import { API, Auth } from 'aws-amplify';

const AddressDisplay: FunctionComponent<{ address: AddressFormValues }> = ({
  address,
}) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={1}>
      <Typography variant='h6'>{t('checkout.customer-name') + ': '}</Typography>
      <Typography variant='body2'>
        {address.firstName} {address.lastName}
      </Typography>
      <Typography variant='h6'>
        {t('checkout.shippingAddress') + ': '}
      </Typography>
      <Typography variant='body2'>
        {address.addressLine1}{' '}
        {address.addressLine2 && (
          <>
            {address.addressLine2} <br />
          </>
        )}
      </Typography>
      <Typography variant='body2'>
        {address.city}, {address.provinceState} {address.country}{' '}
        {address.zipPostalCode}
      </Typography>
    </Stack>
  );
};

const KeyDisplay: FunctionComponent<{ keyDefault: KeyDefaultValues }> = ({
  keyDefault,
}) => {
  return (
    <Box sx={{ justifyContent: 'center' }}>
      <Card sx={{ display: 'flex', maxWidth: 500 }}>
        <CardMedia
          component='img'
          sx={{ width: 151 }}
          image={keyImageLocation(keyDefault.product_name)}></CardMedia>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component='div' variant='h5'>
              {keyDefault.product_name}
            </Typography>
            <Typography component='div' variant='subtitle1'>
              {keyCustomDescription(keyDefault.product_name)}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

const keyImageLocation = (prodName: string): string => {
  return invConfig[prodName].imageLocation;
};

const keyCustomDescription = (prodName: string): string => {
  return invConfig[prodName].customDescription;
};

export const Confirmation: FunctionComponent<ConfirmationProps> = ({
  deliveryForm,
  keyDefault,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [called, setCalled] = useState(false);
  const [hasKey] = useState(keyDefault.product_id !== 0);
  if (!hasKey) {
    history.push(AppRoutePath.Order + OrderRoutePath.KeyDefault);
  }
  const submitOrder = async () => {
    setCalled(true);
    //const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const apiName = 'yedselfsvcex';
    const path = '/order/create';
    const myInit = {
      body: {
        channelpartner_id: 1,
        delivery_type: 1,
        country_code_2: deliveryForm.shippingAddress.country,
        recipient: `${deliveryForm.shippingAddress.firstName} ${deliveryForm.shippingAddress.lastName}`,
        recipient_email: '',
        recipient_firstname: deliveryForm.shippingAddress.firstName,
        recipient_lastname: deliveryForm.shippingAddress.lastName,
        recipient_telephone: '',
        street_line1: deliveryForm.shippingAddress.addressLine1,
        street_line2: deliveryForm.shippingAddress.addressLine2,
        street_line3: '',
        city: deliveryForm.shippingAddress.city,
        region: deliveryForm.shippingAddress.provinceState,
        postal_code: deliveryForm.shippingAddress.zipPostalCode,
        shipment_items: [
          {
            product_id: keyDefault.product_id,
            inventory_product_id: keyDefault.product_id,
            shipment_product_quantity: 1,
          },
        ],
      },
      /*
        headers: {
            Authorization: `Bearer ${token}`
        },
        */
      response: true,
      queryStringParameters: {},
    };

    const response = await API.post(apiName, path, myInit);
    history.push(AppRoutePath.Order + OrderRoutePath.OrderHistory);
  };
  const editAddress = () => {
    history.push(AppRoutePath.Order + OrderRoutePath.Delivery);
  };
  return (
    <>
      {!hasKey && <></>}
      {hasKey && (
        <>
          <OrderStepper />
          {!called && (
            <Box
              mt={4}
              sx={{
                display: 'grid',
                gridTemplateRows: 'repeat(1, 1fr)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Typography variant='h4' component='legend' gutterBottom>
                {t('order.item')}
              </Typography>
              <KeyDisplay keyDefault={keyDefault} />
              <Box mt={3}>
                <Typography variant='h4' gutterBottom>
                  {t('checkout.shippingAddress')}
                </Typography>
                <AddressDisplay address={deliveryForm.shippingAddress} />
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridAutoColumns: '1fr',
                  gap: 1,
                  alignItems: 'center',
                }}
                mt={3}>
                <Box sx={{ gridRow: '1', gridColumn: 'span 1' }}>
                  <Button
                    type='reset'
                    variant='contained'
                    size='small'
                    onClick={editAddress}>
                    {t('checkout.correct-address')}
                  </Button>
                </Box>
                <Box
                  sx={{
                    gridRow: '1',
                    gridColumn: 'span 1',
                    textAlign: 'right',
                  }}>
                  <Button
                    type='button'
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={submitOrder}>
                    {t('checkout.place-order')}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
          {called && (
            <Box
              mt={4}
              sx={{
                display: 'grid',
                gridTemplateRows: 'repeat(1, 1fr)',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
              <Typography variant='h6' gutterBottom>
                {t('checkout.order-submit')}
              </Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default connect(mapStateToProps)(Confirmation);
