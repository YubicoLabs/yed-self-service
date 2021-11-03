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

/**
 * Calls to the Lambda API, which gathers all of the orders that belong to a specific user - User is determined by the JWT token that is sent by the users session
 * @returns An array of shipments belonging to the user
 */
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

/**
 * Calls to the invConfig file to pull out the image location for an inventory item
 * @param prodName Product Name, the name of the product as found in the GET /products API
 * @returns a string containing the image location to reference 
 */
const keyImageLocation = (prodName: string): string => {
  return invConfig[prodName].imageLocation;
};

/**
 * Calls to the invConfig file to pull out the custom description for an inventory item
 * @param prodName Product Name, the name of the product as found in the GET /products API
 * @returns a string containing the custom description to reference 
 */
const keyCustomDescription = (prodName: string): string => {
  return invConfig[prodName].customDescription;
};

/**
 * Helper function to format the date in a readable form when displaying on the web page - The YED API returns a long form date
 * @param dateTime string correlating to the date time returned by the YED API 
 * @returns formatted date
 */
const formatDate = (dateTime: string): string => {
  const toFormat = new Date(dateTime);
  return toFormat.toLocaleDateString();
};

/**
 * Renders the information for a specific order
 * @param orderDetails Fields from the YED API about this specific order - Equivalent to calling GET /shipments_exact/{id} 
 * @param refreshList Function defined in the higher level component used to refresh the list
 * @returns Component to render the Order information
 */
const OrderCard: FunctionComponent<{
  orderDetails: any;
  refreshList: any;
}> = ({ orderDetails, refreshList }) => {
  const orderID = orderDetails.shipment_id;
  const { t } = useTranslation();

  const history = useHistory();

  /**
   * Handles the case of an edit button is clicked, will redirect the user to the delivery page, with the information needed to default the order information
   */
  const handleEdit = () => {
    history.push(
      AppRoutePath.Order + OrderRoutePath.Delivery + `/edit/${orderID}`
    );
  };

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
                      {t('order-history.order-arrived')}{' '}
                      {formatDate(orderDetails.delivered_date)}
                    </Alert>
                  )}
                  {orderDetails.shipment_state_id <= 9 && (
                    <Button
                      type='button'
                      variant='outlined'
                      color='primary'
                      onClick={handleEdit}>
                       {t('order-history.edit-shipment')}
                    </Button>
                  )}
                  {orderDetails.shipment_state_id <= 9 && (
                    <DeleteModal
                      orderDetails={orderDetails}
                      refreshList={refreshList}
                    />
                  )}
                  {orderDetails.tracking_link && (
                  <Button
                  variant='contained'
                  target='_blank'
                  href={orderDetails.tracking_link}
                  color='primary'>
                  {t('order-history.track-your-package')}
                </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          );
        })}
      </CardContent>
    </Card>
  );
};

/**
 * Renders the information for the address of a specific order (done to break up parts of the component)
 * @param orderDetails Fields from the YED API about this specific order - Equivalent to calling GET /shipments_exact/{id} 
 * @returns Component to render the Address Order information
 */
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

/**
 * Used to render and define the HTML required to pop up a modal for the delete function on order items (where applicable)
 * @param orderDetails Fields from the YED API about this specific order - Equivalent to calling GET /shipments_exact/{id} 
 * @param refreshList Used to refresh the list after a deletion occurs
 * @returns Component to render the Address Order information
 */
const DeleteModal: FunctionComponent<{
  orderDetails: any;
  refreshList: any;
}> = ({ orderDetails, refreshList }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();

  return (
    <>
      <Button onClick={handleOpen} variant='contained' color='error'>
      {t('order-history.delete-order')}
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
            {t('order-history.sure-delete')}
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
                  {t('order-history.delete-order')}
                </Button>
                <Button
                  type='button'
                  variant='outlined'
                  color='primary'
                  onClick={handleClose}>
                  {t('order-history.close')}
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

/**
 * Function to call to the YED API to delete the shipment based on the  ID
 * @param shipmentId ID of the shipment to delete
 */
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

    //Sorts the orders by date, and reverses it to put the newest orders at the top
    const orders_sorted = orders.sort(function(a: any, b: any) {
      return Date.parse(a.shipment_request_date) - Date.parse(b.shipment_request_date);
    });

    setOrderList(orders_sorted.reverse());
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
