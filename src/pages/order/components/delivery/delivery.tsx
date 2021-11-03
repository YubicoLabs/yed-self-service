import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { AppRoutePath } from '../../../../routes/app-route-path';
import { OrderRoutePath } from '../../routes/order-route-path';
import { AddressForm } from '../address/address-form';
import { KeyDefaultValues } from '../key-default/key-default-values.interface';
import { OrderStepper } from '../order-stepper/order-stepper';

import { AddressFormValues } from '../address/address-form-values.interface';
import { DeliveryFormValues } from './delivery-form-values.interface';
import { deliveryFormSchema } from './delivery-form.schema';
import {
  DeliveryFormProps,
  mapDispatchToProps,
  mapStateToProps,
} from './delivery.props';

import { CardContent, CardMedia } from '@mui/material';
import { Box } from '@mui/system';
import { Button, FormControl, Typography } from '@material-ui/core';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@material-ui/core/styles';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import ClearIcon from '@material-ui/icons/Clear';
import { Form, Formik } from 'formik';

import { API, Auth } from 'aws-amplify';

import invConfig from '../../../../inv-config';

const DeliveryFormControl = styled(FormControl)(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(2),
}));

const keyImageLocation = (prodName: string): string => {
  return invConfig[prodName].imageLocation;
};

const keyCustomDescription = (prodName: string): string => {
  return invConfig[prodName].customDescription;
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

const Loading: FunctionComponent = () => {
  return (
    <>
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
          Setting up your order
        </Typography>
      </Box>
    </>
  )
}

let VerifyAddress = async (address: AddressFormValues): Promise<any> => {
  const postBody = {
    street_line1: address.addressLine1,
    street_line2: address.addressLine2,
    city: address.city,
    postal_code: address.zipPostalCode,
    region: address.provinceState,
    country_code_2: address.country,
  };

  const token = (await Auth.currentSession()).getIdToken().getJwtToken();
  const apiName = 'yedselfsvcex';
  const path = '/address';
  const myInit = {
    body: postBody,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    response: true,
    queryStringParameters: {},
  };
  const response = await API.post(apiName, path, myInit);
  if (response.data.status === 'undeliverable') {
    return {
      deliverable: false,
      called: true,
      isValid: false,
      message: response.data.details,
    };
  } else if (response.data.status === 'deliverable') {
    return {
      deliverable: true,
    };
  }
};

const setEditOrder = async (id: string): Promise<any> => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();
  const apiName = 'yedselfsvcex';
  const path = `/order/${id}`;
  const myInit = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    response: true,
    queryStringParameters: {},
  };
  const response = await API.get(apiName, path, myInit);
  return response.data;
}

const Delivery: FunctionComponent<DeliveryFormProps> = ({
  deliveryForm,
  submitDeliveryForm,
  clearDeliveryForm,
  submitKeyDefault,
  submitFormAction,
  keyDefault,
  formAction,
  clearEditOrderId,
  submitEditOrderId,
  editOrderId

}) => {
  const [message, setMessage] = useState([{ description: '' }]);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();
  const { action, id } = useParams<{ action:string, id: string }>();
  const [hasKey, setHasKey] = useState(keyDefault.product_id !== 0);

  if(!hasKey && action !== 'edit') {
    clearDeliveryForm();
      clearEditOrderId();
      history.push(AppRoutePath.Order + OrderRoutePath.KeyDefault);
  }
  if(action === 'edit' && id !== editOrderId) {
    clearDeliveryForm();
    submitFormAction('edit');
    setEditOrder(id).then((res) => {
      const newAddrFV: AddressFormValues = {
        firstName: res.recipient_firstname || "",
        lastName: res.recipient_lastname || "",
        addressLine1: res.street_line1,
        addressLine2: res.street_line2 || "",
        city: res.city,
        provinceState: res.region,
        country: res.country_code_2,
        zipPostalCode: res.postal_code,
      }
      const newDFV: DeliveryFormValues = {
        shippingAddress: newAddrFV
      }

      submitDeliveryForm(newDFV);
      const newKeyDef: KeyDefaultValues = {
        product_id: res.shipment_items[0].product_id,
        product_name: res.shipment_items[0].product_name,
        product_code: res.shipment_items[0].product_code || "undef",
        product_tier: res.shipment_items[0].product_tier,
        inventory_type: res.shipment_items[0].inventory_type,
        product_quantity: res.shipment_items[0].shipment_product_quantity
      }
      submitKeyDefault(newKeyDef);
      submitEditOrderId(res.shipment_id)
      setHasKey(keyDefault.product_id !== 0);
    });

  } 

  const submitForm = (values: DeliveryFormValues) => {
    setLoading(true);
    submitDeliveryForm(values);
    VerifyAddress(values.shippingAddress).then((res) => {
      if (res === undefined) {
        setMessage([
          { description: 'There was an error validating your address' },
        ]);
        setLoading(false);
        return;
      } else {
        if (res.deliverable) {
          console.log("The sending action is: " + formAction)
          history.push(AppRoutePath.Order + OrderRoutePath.Confirmation);
        } else {
          setIsValid(false);
          setMessage(res.message);
          setLoading(false);
        }
      }
    });
  };

  return (
    <>
      {!hasKey && <><Loading /></>}
      {hasKey && (
        <>
          <OrderStepper />
          <Box
            mt={4}
            sx={{
              display: 'grid',
              gridTemplateRows: 'repeat(1, 1fr)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Typography variant='h5' component='legend' gutterBottom>
              {t('order.item')}
            </Typography>
            <KeyDisplay keyDefault={keyDefault} />
          </Box>
          <Box
            mt={4}
            sx={{
              display: 'grid',
              gridTemplateRows: 'repeat(1, 1fr)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {!isValid && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                {message.map(function (item: any, index) {
                  return (
                    <Alert key={index} severity='error'>
                      {item.description}
                    </Alert>
                  );
                })}
              </Stack>
            )}
          </Box>
          <Formik
          enableReinitialize={true}
          validationSchema={deliveryFormSchema(t)}
          initialValues={deliveryForm}
          onSubmit={submitForm}>
          {({ errors, touched, values }) => (
            <Form>
              <DeliveryFormControl>
                <Typography variant='h5' component='legend' gutterBottom>
                  {t('order.shippingAddress')}
                </Typography>
                <AddressForm
                  formName='shippingAddress'
                  errors={errors.shippingAddress}
                  touched={touched.shippingAddress}
                />
              </DeliveryFormControl>
              <Box
                sx={{
                  display: 'grid',
                  gridAutoColumns: '1fr',
                  gap: 1,
                }}
                mt={3}>
                <Box sx={{ gridRow: '1', gridColumn: 'span 1' }}>
                  <Button
                    type='reset'
                    variant='contained'
                    endIcon={<ClearIcon />}
                    size='small'
                    onClick={clearDeliveryForm}>
                    {t('order.clear')}
                  </Button>
                </Box>
                {!loading && (
                  <Box
                    sx={{
                      gridRow: '1',
                      gridColumn: 'span 1',
                      textAlign: 'right',
                    }}>
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      endIcon={<ArrowRightAltIcon />}
                      size='large'>
                      {t('order.validate-address')}
                    </Button>
                  </Box>
                )}
                {loading && (
                  <Box
                    sx={{
                      gridRow: '1',
                      gridColumn: 'span 1',
                      textAlign: 'right',
                    }}>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Form>
          )}
        </Formik>
        </>
      )}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Delivery);
