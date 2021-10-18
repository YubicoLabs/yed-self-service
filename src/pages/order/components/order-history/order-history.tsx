import React, { FunctionComponent, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import {
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import invConfig from '../../../../inv-config';

const getOrders = async () => {
  //const token = (await Auth.currentSession()).getIdToken().getJwtToken();
  const apiName = 'yedselfsvcex';
  const path = '/orders';
  const myInit = {
    /*
      headers: {
        Authorization: `Bearer ${token}`
      },
      */
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

const OrderCard: FunctionComponent<{ orderDetails: any; t: any }> = ({
  orderDetails,
  t,
}) => {
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
        <Grid container spacing={2} alignItems='center'>
          <Grid item md={2} xs={12}>
            <CardMedia
              component='img'
              image={keyImageLocation(
                orderDetails.shipment_items[0].product_name
              )}
              sx={{ maxHeight: 300, maxWidth: 300 }}></CardMedia>
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack>
              <Typography component='div' variant='h4'>
                {orderDetails.shipment_items[0].product_name}
              </Typography>
              <Typography component='div' variant='subtitle1'>
                {keyCustomDescription(
                  orderDetails.shipment_items[0].product_name
                )}
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={4} xs={12}>
            <Stack spacing={1}>
              {orderDetails.is_delivered && (
              <Alert severity='success'>Your shipment has arrived</Alert>

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
      </CardContent>
    </Card>
  );
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

const orderTest = {
  shipment_id: 'FgriZs8meWkHReGSvkEhK2',
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

const orderTest2 = {
  shipment_id: 'FgriZs8meWkHReGSvkEhK2',
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
  const [orderList, setOrderList] = useState([orderTest, orderTest2]);

  const refreshList = () => {
    getOrders().then((res) => {
      console.log(res);
      setOrderList(res);
    });
  };

  if (orderList.length === 0) {
    refreshList();
  }

  return (
    <Box mt={3}>
      <Container>
        <Typography variant='h4' component='legend' gutterBottom>
          {t('order-history.title')}
        </Typography>
        <Divider />
        <Box mt={2}>
          <Stack direction='column' spacing={2} divider={<Divider />}>
            {orderList.map(function (item: any, index) {
              return (
              <OrderCard key={index} orderDetails={item} t={t}></OrderCard>
              )
            })}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderHistory;
