import React, { FunctionComponent, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { AppRoutePath } from '../../../../routes/app-route-path';
import { OrderRoutePath } from '../../routes/order-route-path';
import { KeyDefaultValues } from '../key-default/key-default-values.interface';
import { OrderStepper } from '../order-stepper/order-stepper';