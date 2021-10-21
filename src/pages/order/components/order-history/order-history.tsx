import React, { FunctionComponent, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { useHistory } from 'react-router-dom';

import { AppRoutePath } from '../../../../routes/app-route-path';
import { OrderRoutePath } from '../../routes/order-route-path';
import { OrderStepper } from '../order-stepper/order-stepper';

import { Container, Divider, Grid, Stack, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';

import Button from '@mui/material/Button';

import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import invConfig from '../../../../inv-config';
import { CircularProgress } from '@material-ui/core';

const getOrders = async () => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();
  const apiName = 'yedselfsvcex';
  const path = '/orders';
  const myInit = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    response: true,
    queryStringParameters: {},
  };

  const response = await API.get(apiName, path, myInit);
  return response.data;
};

const keyImageLocation = (prodName: string): string => {
  return invConfig[prodName].imageLocation;
};

const keyCustomDescription = (prodName: string): string => {
  return invConfig[prodName].customDescription;
};

const formatDate = (dateTime: string): string => {
  const toFormat = new Date(dateTime);
  return toFormat.toLocaleDateString();
};

const OrderCard: FunctionComponent<{
  orderDetails: any;
  t: any;
  refreshList: any;
}> = ({ orderDetails, t, refreshList }) => {
  return (
    <Card>
      <CardContent sx={{ bgcolor: '#f5f5f5' }}>
        <Grid container spacing={1} alignItems='flex-start'>
          <Grid item md={4} xs={6}>
            <Stack>
              <Typography component='div' variant='h5'>
                {t('order-history.order-placed')}
              </Typography>
              <Typography component='div' variant='subtitle1'>
                {formatDate(orderDetails.shipment_request_date)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={4} xs={6}>
            <Stack>
              <Typography component='div' variant='h5'>
                {t('order-history.ship-to')}
              </Typography>
              <AddressDisplay orderDetails={orderDetails}></AddressDisplay>
            </Stack>
          </Grid>
          <Grid item md={4} xs={6}>
            <Stack>
              <Typography component='div' variant='h5'>
                {t('order-history.order-number')}
              </Typography>
              <Typography component='div' variant='subtitle1'>
                {orderDetails.shipment_id}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardContent>
        {orderDetails.shipment_items.map((item: any, index: number) => {
          return (
            <Grid key={index} container spacing={2} alignItems='center'>
              <Grid item md={2} xs={12}>
                <CardMedia
                  component='img'
                  image={keyImageLocation(item.product_name)}
                  sx={{ maxHeight: 300, maxWidth: 300 }}></CardMedia>
              </Grid>
              <Grid item md={6} xs={12}>
                <Stack>
                  <Typography component='div' variant='h4'>
                    {item.product_name}
                  </Typography>
                  <Typography component='div' variant='subtitle1'>
                    {keyCustomDescription(item.product_name)}
                  </Typography>
                  <Typography component='div' variant='subtitle2'>
                    {`Quantity: x${item.shipment_product_quantity}`}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={4} xs={12}>
                <Stack spacing={1}>
                  {orderDetails.is_delivered && (
                    <Alert severity='success'>
                      Your shipment arrived{' '}
                      {formatDate(orderDetails.delivered_date)}
                    </Alert>
                  )}
                  {orderDetails.shipment_state_id <= 9 && (
                    <Button
                      variant='contained'
                      target='_blank'
                      href={orderDetails.tracking_link}
                      color='primary'>
                      Edit Shipment
                    </Button>
                  )}
                  {orderDetails.shipment_state_id <= 9 && (
                    <DeleteModal
                      orderDetails={orderDetails}
                      t={t}
                      refreshList={refreshList}
                    />
                  )}
                  <Button
                    variant='contained'
                    target='_blank'
                    href={orderDetails.tracking_link}
                    color='primary'>
                    Track your package
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          );
        })}
      </CardContent>
    </Card>
  );
};
const deleteShipment = async (shipmentId: string) => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();
  const apiName = 'yedselfsvcex';
  const path = `/order/${shipmentId}`;
  const myInit = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    response: true,
    queryStringParameters: {},
  };

  await API.del(apiName, path, myInit);
};

const AddressDisplay: FunctionComponent<{ orderDetails: any }> = ({
  orderDetails,
}) => {
  return (
    <Stack spacing={0}>
      <Typography variant='body2'>
        {orderDetails.street_line1}{' '}
        {orderDetails.street_line2 && (
          <>
            {orderDetails.street_line2} <br />
          </>
        )}
      </Typography>
      <Typography variant='body2'>
        {orderDetails.city}, {orderDetails.region} {orderDetails.country_code_2}{' '}
        {orderDetails.postal_code}
      </Typography>
    </Stack>
  );
};

const DeleteModal: FunctionComponent<{
  orderDetails: any;
  t: any;
  refreshList: any;
}> = ({ orderDetails, t, refreshList }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen} variant='contained' color='error'>
        Delete Order
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#ffffff',
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
          }}>
          <Stack spacing={2}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Are you sure you want to delete order #{orderDetails.shipment_id}?
            </Typography>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>
                <CircularProgress />
              </Box>
            )}
            {!loading && (
              <>
                <Button
                  type='button'
                  variant='contained'
                  color='error'
                  onClick={async () => {
                    setLoading(true);
                    await deleteShipment(orderDetails.shipment_id);
                    handleClose();
                    refreshList();
                  }}>
                  Delete Order
                </Button>
                <Button
                  type='button'
                  variant='outlined'
                  color='primary'
                  onClick={handleClose}>
                  Close
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

const orderTest = {
  shipment_id: 'Tyy568meWkHReGSvkEhK2',
  shipment_items: [
    {
      shipment_product_id: '4ovpK6emQRkA1sgYECwPw2',
      inventory_product_id: 5,
      shipment_id: 'FgriZs8meWkHReGSvkEhK2',
      product_id: 5,
      product_name: 'YubiKey 5Ci',
      product_sku: '5060408461969',
      product_tier: 3,
      shipment_product_quantity: 1,
      shipment_product_line_cost: 5000,
    },
  ],
  organization_id: 'RUjzDraV1ud9bhLNhjeEW',
  channelpartner_id: 1,
  channelpartner_name: 'Yubico (Direct sale)',
  user_email: 'c.salas@yubico.com',
  user_id: 'Qj8c5cZNwZtNe8zejeJxfp',
  country_code_2: 'US',
  is_delivered: false,
  is_post_pay: true,
  is_sent_to_fulfillment: true,
  is_shipped: true,
  recipient: 'Cody Salas',
  recipient_firstname: 'Cody',
  recipient_lastname: 'Salas',
  street_line1: '1111 Rusk St',
  street_line2: '1116',
  city: 'Houston',
  region: 'TX',
  postal_code: '77002',
  suggest_street_line1: '1111 RUSK ST',
  suggest_street_line2: 'APT 1116',
  suggest_city: 'HOUSTON',
  suggest_region: 'TX',
  suggest_postal_code: '77002-3447',
  delivery_type: 1,
  carrier: 'FEDEX',
  tracking_number: 'TESTFEDEXGROUND',
  tracking_link:
    'https://www.fedex.com/apps/fedextrack/index.html?tracknumbers=TESTFEDEXGROUND',
  shipped_date: '2020-02-04T00:00:00Z',
  shipment_state_code: 'ShipmentStateShipped',
  shipment_state_id: 9,
  shipment_state_message: 'Shipped: In transit.',
  shipment_summary_description: 'Total Keys: 1 yk5ci:1',
  shipment_request_date: '2021-10-18T15:38:34.397Z',
  shipment_updated_date: '2021-10-18T16:00:41.965Z',
  shipment_product_cost: 5000,
  shipment_product_taxes: 413,
  shipping_service_cost: 1000,
  shipping_service_taxes: 83,
  total_shipment_product_cost: 5413,
  total_shipment_tax_cost: 496,
  total_shipping_service_cost: 1083,
  total_keys_shipped: 1,
};

const orderTest2 = {
  shipment_id: 'UUih68meWkHReGSvkEhK2',
  shipment_items: [
    {
      shipment_product_id: '4ovpK6emQRkA1sgYECwPw2',
      inventory_product_id: 5,
      shipment_id: 'FgriZs8meWkHReGSvkEhK2',
      product_id: 5,
      product_name: 'YubiKey 5Ci',
      product_sku: '5060408461969',
      product_tier: 3,
      shipment_product_quantity: 1,
      shipment_product_line_cost: 5000,
    },
  ],
  organization_id: 'RUjzDraV1ud9bhLNhjeEW',
  channelpartner_id: 1,
  channelpartner_name: 'Yubico (Direct sale)',
  user_email: 'c.salas@yubico.com',
  user_id: 'Qj8c5cZNwZtNe8zejeJxfp',
  country_code_2: 'US',
  is_delivered: true,
  is_post_pay: true,
  is_sent_to_fulfillment: true,
  is_shipped: true,
  recipient: 'Cody Salas',
  recipient_firstname: 'Cody',
  recipient_lastname: 'Salas',
  street_line1: '1111 Rusk St',
  street_line2: '1116',
  city: 'Houston',
  region: 'TX',
  postal_code: '77002',
  suggest_street_line1: '1111 RUSK ST',
  suggest_street_line2: 'APT 1116',
  suggest_city: 'HOUSTON',
  suggest_region: 'TX',
  suggest_postal_code: '77002-3447',
  delivery_type: 1,
  delivered_date: '2021-10-20T14:15:22Z',
  carrier: 'FEDEX',
  tracking_number: 'TESTFEDEXGROUND',
  tracking_link:
    'https://www.fedex.com/apps/fedextrack/index.html?tracknumbers=TESTFEDEXGROUND',
  shipped_date: '2020-02-04T00:00:00Z',
  shipment_state_code: 'ShipmentStateShipped',
  shipment_state_id: 103,
  shipment_state_message: 'Shipped: In transit.',
  shipment_summary_description: 'Total Keys: 1 yk5ci:1',
  shipment_request_date: '2021-10-18T15:38:34.397Z',
  shipment_updated_date: '2021-10-18T16:00:41.965Z',
  shipment_product_cost: 5000,
  shipment_product_taxes: 413,
  shipping_service_cost: 1000,
  shipping_service_taxes: 83,
  total_shipment_product_cost: 5413,
  total_shipment_tax_cost: 496,
  total_shipping_service_cost: 1083,
  total_keys_shipped: 1,
};

const OrderHistory: FunctionComponent = () => {
  const { t } = useTranslation();
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initCall, setInitCall] = useState(true);

  const refreshList = async () => {
    if (!initCall) {
      setLoading(true);
    }
    const orders = await getOrders();
    //orders.push(orderTest2);
    //orders.push(orderTest);
    setOrderList(orders);
    setLoading(false);
  };

  if (initCall) {
    refreshList();
    setInitCall(false);
  }

  return (
    <>
      <OrderStepper />
      <Box mt={3}>
        <Container>
          <Typography variant='h4' component='legend' gutterBottom>
            {t('order-history.title')}
          </Typography>
          <Divider />
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>
              <CircularProgress />
            </Box>
          )}
          {!loading && (
            <Box mt={2}>
              {orderList.length > 0 && (
                <Stack direction='column' spacing={2} divider={<Divider />}>
                  {orderList.map(function (item: any, index) {
                    return (
                      <OrderCard
                        key={index}
                        orderDetails={item}
                        t={t}
                        refreshList={refreshList}></OrderCard>
                    );
                  })}
                </Stack>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default OrderHistory;
