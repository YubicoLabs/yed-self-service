import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { AppRoutePath } from '../../../../routes/app-route-path';
import { OrderRoutePath } from '../../routes/order-route-path';
import { KeyDefaultValues } from './key-default-values.interface';
import { connect } from 'react-redux';

import { CircularProgress, Typography, Box } from '@material-ui/core';

import { API, Auth } from 'aws-amplify';

import {
  KeyDefaultProps,
  mapDispatchToProps,
  mapStateToProps,
} from './key-default.props';

/**
 * Calls to the default key API that is configured in the lambda 
 * @returns the product information for the default key set by the organization
 */
let getDefaultKey = async (): Promise<KeyDefaultValues> => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();
  const apiName = 'yedselfsvcex';
  const path = '/defaultinventory';
  const myInit = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    response: true,
    queryStringParameters: {},
  };
  const response = await API.get(apiName, path, myInit);
  return {
    product_id: response.data.product_id,
    product_name: response.data.product_name,
    product_code: response.data.product_code,
    product_tier: response.data.product_tier,
    inventory_type: response.data.inventory_type,
    product_quantity: 1
  };
};

/**
 * 
 * @param Properties Used to submit the key and the type of action being performed 
 * @returns A loading screen where the default key is being pulled in the background, and the form action set to create
 */
const KeyDefault: FunctionComponent<KeyDefaultProps> = ({
  submitKeyDefault,
  submitFormAction
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  /**
   * 
   * @param values Values of the Key that has been defaulted by the user 
   */
  const submitKey = (values: KeyDefaultValues) => {
    submitKeyDefault(values);
    submitFormAction('create');
    history.push(AppRoutePath.Order + OrderRoutePath.Delivery);
  };

  /**
   * Will call to the Lambda API to get the default key that has been configured by the organization
   */
  getDefaultKey().then((res) => {
    submitKey(res);
  });

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
          {t('key-default.getting-key')}
        </Typography>
      </Box>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyDefault);
