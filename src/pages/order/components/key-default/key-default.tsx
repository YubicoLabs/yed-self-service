import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { AppRoutePath } from '../../../../routes/app-route-path';
import { OrderRoutePath } from '../../routes/order-route-path';
import { KeyDefaultValues } from './key-default-values.interface';
import { connect } from 'react-redux';

import {
  KeyDefaultProps,
  mapDispatchToProps,
  mapStateToProps,
} from './key-default.props';
import { CircularProgress, Typography, Box } from '@material-ui/core';

let getDefaultKey = async (): Promise<KeyDefaultValues> => {
  console.log('Getting default key');
  const URL = `${process.env.REACT_APP_API_URL}/defaultinventory`;
  const ret = await fetch(URL)
    .then(
      (response) => response.json(),
      (error) => {
        throw new Error(error);
      }
    )
    .then((data) => {
      console.log('Data is: ');
      console.log(data);
      return {
        product_id: data.product_id,
        product_name: data.product_name,
        product_code: data.product_code,
        product_tier: data.product_tier,
        inventory_type: data.inventory_type,
      };
    });
  return ret;
};

const KeyDefault: FunctionComponent<KeyDefaultProps> = ({
  submitKeyDefault,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const submitKey = (values: KeyDefaultValues) => {
    submitKeyDefault(values);
    history.push(AppRoutePath.Order + OrderRoutePath.Delivery);
  };

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
