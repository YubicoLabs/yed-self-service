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
          );
        })}
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

const OrderHistory: FunctionComponent = () => {
  const { t } = useTranslation();
  const [orderList, setOrderList] = useState([]);

  const refreshList = async () => {
    const orders = await getOrders();
    setOrderList(orders);
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
          {orderList.length > 0 && (
            <Stack direction='column' spacing={2} divider={<Divider />}>
              {orderList.map(function (item: any, index) {
                return (
                  <OrderCard key={index} orderDetails={item} t={t}></OrderCard>
                );
              })}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default OrderHistory;
