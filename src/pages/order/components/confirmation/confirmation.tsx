import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { AddressFormValues } from "../address/address-form-values.interface";
import { KeyDefaultValues } from "../key-default/key-default-values.interface";

import { OrderStepper } from "../order-stepper/order-stepper";

import { ConfirmationProps, mapStateToProps } from "./confirmation.props";
import { AppRoutePath } from "../../../../routes/app-route-path";
import { OrderRoutePath } from "../../routes/order-route-path";
import { useHistory } from "react-router-dom";

import { Typography, Button, CircularProgress } from "@material-ui/core";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/system";
import Card from "@mui/material/Card";
import { CardContent, CardMedia } from "@mui/material";

import { API, Auth } from "aws-amplify";
import invConfig from "../../../../inv-config";

/**
 * Function Component to render the address information the user has entered for their order
 * @param address The address values that will be displayed on the confirmation page
 * @returns The component to render a users address
 */
const AddressDisplay: FunctionComponent<{ address: AddressFormValues }> = ({
  address,
}) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={1}>
      <Typography variant="h6">{t("checkout.customer-name") + ": "}</Typography>
      <Typography variant="body2">
        {address.firstName} {address.lastName}
      </Typography>
      <Typography variant="h6">
        {t("checkout.shippingAddress") + ": "}
      </Typography>
      <Typography variant="body2">
        {address.addressLine1}{" "}
        {address.addressLine2 && (
          <>
            {address.addressLine2} <br />
          </>
        )}
      </Typography>
      <Typography variant="body2">
        {address.city}, {address.provinceState} {address.country}{" "}
        {address.zipPostalCode}
      </Typography>
      <Typography variant="h6">
        {t("checkout.customer-phone") + ": "}
      </Typography>
      <Typography variant="body2">{address.phoneNumber}</Typography>
    </Stack>
  );
};

/**
 * Used to render information for the key selected by the user
 * @param keyDefault The inventory item the user has selected
 * @returns The component to render a users "cart" containing their selected keys
 */
const KeyDisplay: FunctionComponent<{ keyDefault: KeyDefaultValues }> = ({
  keyDefault,
}) => {
  return (
    <Box sx={{ justifyContent: "center" }}>
      <Card sx={{ display: "flex", maxWidth: 500 }}>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={keyImageLocation(keyDefault.product_name)}></CardMedia>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {keyDefault.product_name}
            </Typography>
            <Typography component="div" variant="subtitle1">
              {keyCustomDescription(keyDefault.product_name)}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
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

export const Confirmation: FunctionComponent<ConfirmationProps> = ({
  deliveryForm,
  keyDefault,
  formAction,
  editOrderId,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  //Flag to determine if the loading bar should appear to prevent multiple submit presses
  const [called, setCalled] = useState(false);

  //Flag to determine if the user has selected a key, if not then the component will redirect the user to Key Default to select a key
  const [hasKey] = useState(keyDefault.product_id !== 0);

  if (!hasKey) {
    history.push(AppRoutePath.Order + OrderRoutePath.KeyDefault);
  }

  /**
   * Function to submit the order to the YED API using POST /shipments_exact
   * The call is made using the Amplify API library - https://docs.amplify.aws/lib/restapi/getting-started/q/platform/js/#aws-regional-endpoints
   * Method will not return, but will redirect the user to the order history stage of the form
   */
  const submitOrder = async () => {
    setCalled(true);
    const postBody = {
      channelpartner_id: 1,
      delivery_type: 1,
      country_code_2: deliveryForm.shippingAddress.country,
      recipient: `${deliveryForm.shippingAddress.firstName} ${deliveryForm.shippingAddress.lastName}`,
      recipient_email: "",
      recipient_firstname: deliveryForm.shippingAddress.firstName,
      recipient_lastname: deliveryForm.shippingAddress.lastName,
      recipient_telephone: deliveryForm.shippingAddress.phoneNumber,
      street_line1: deliveryForm.shippingAddress.addressLine1,
      street_line2: deliveryForm.shippingAddress.addressLine2,
      street_line3: "",
      city: deliveryForm.shippingAddress.city,
      region: deliveryForm.shippingAddress.provinceState,
      postal_code: deliveryForm.shippingAddress.zipPostalCode,
      shipment_items: [
        {
          product_id: keyDefault.product_id,
          inventory_product_id: keyDefault.product_id,
          shipment_product_quantity: keyDefault.product_quantity,
        },
      ],
    };

    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const apiName = "yedselfsvcex";
    const path = "/order/create";
    const myInit = {
      body: postBody,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      response: true,
      queryStringParameters: {},
    };

    await API.post(apiName, path, myInit);
    history.push(AppRoutePath.Order + OrderRoutePath.OrderHistory);
  };

  /**
   * Function to submit the order to the YED API using PUT /shipments_exact/{orderID}
   * The call is made using the Amplify API library - https://docs.amplify.aws/lib/restapi/getting-started/q/platform/js/#aws-regional-endpoints
   * Method will not return, but will redirect the user to the order history stage of the form
   */
  const editOrder = async () => {
    setCalled(true);
    const postBody = {
      channelpartner_id: 1,
      delivery_type: 1,
      country_code_2: deliveryForm.shippingAddress.country,
      recipient: `${deliveryForm.shippingAddress.firstName} ${deliveryForm.shippingAddress.lastName}`,
      recipient_email: "",
      recipient_firstname: deliveryForm.shippingAddress.firstName,
      recipient_lastname: deliveryForm.shippingAddress.lastName,
      recipient_telephone: deliveryForm.shippingAddress.phoneNumber,
      street_line1: deliveryForm.shippingAddress.addressLine1,
      street_line2: deliveryForm.shippingAddress.addressLine2,
      street_line3: "",
      city: deliveryForm.shippingAddress.city,
      region: deliveryForm.shippingAddress.provinceState,
      postal_code: deliveryForm.shippingAddress.zipPostalCode,
      shipment_items: [
        {
          product_id: keyDefault.product_id,
          inventory_product_id: keyDefault.product_id,
          shipment_product_quantity: keyDefault.product_quantity,
        },
      ],
    };

    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const apiName = "yedselfsvcex";
    const path = `/order/${editOrderId}`;
    const myInit = {
      body: postBody,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      response: true,
      queryStringParameters: {},
    };

    await API.put(apiName, path, myInit);
    history.push(AppRoutePath.Order + OrderRoutePath.OrderHistory);
  };

  /**
   * Will redirect a user back to the Delivery/Address form to change their address - No variables are altered in this state
   */
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
                display: "grid",
                gridTemplateRows: "repeat(1, 1fr)",
                justifyContent: "center",
                alignItems: "center",
              }}>
              {formAction === "edit" && (
                <>
                  <Typography variant="h4" component="legend" gutterBottom>
                    {t("order.edit-order")}
                  </Typography>
                  <Typography variant="h5" component="legend" gutterBottom>
                    {editOrderId}
                  </Typography>
                </>
              )}
              <Typography variant="h4" component="legend" gutterBottom>
                {t("order.item")}
              </Typography>
              <KeyDisplay keyDefault={keyDefault} />
              <Box mt={3}>
                <Typography variant="h4" gutterBottom>
                  {t("checkout.shippingAddress")}
                </Typography>
                <AddressDisplay address={deliveryForm.shippingAddress} />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridAutoColumns: "1fr",
                  gap: 1,
                  alignItems: "center",
                }}
                mt={3}>
                <Box sx={{ gridRow: "1", gridColumn: "span 1" }}>
                  <Button
                    type="reset"
                    variant="contained"
                    size="small"
                    onClick={editAddress}>
                    {t("checkout.correct-address")}
                  </Button>
                </Box>
                {formAction === "edit" && (
                  <>
                    <>
                      <Box
                        sx={{
                          gridRow: "1",
                          gridColumn: "span 1",
                          textAlign: "right",
                        }}>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={editOrder}>
                          {t("checkout.edit-order")}
                        </Button>
                      </Box>
                    </>
                  </>
                )}
                {formAction === "create" && (
                  <>
                    <Box
                      sx={{
                        gridRow: "1",
                        gridColumn: "span 1",
                        textAlign: "right",
                      }}>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={submitOrder}>
                        {t("checkout.place-order")}
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          )}
          {called && (
            <Box
              mt={4}
              sx={{
                display: "grid",
                gridTemplateRows: "repeat(1, 1fr)",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
              <Typography variant="h6" gutterBottom>
                {t("checkout.order-submit")}
              </Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default connect(mapStateToProps)(Confirmation);
