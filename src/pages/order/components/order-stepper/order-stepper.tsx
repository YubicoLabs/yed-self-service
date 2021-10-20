import { Step, StepLabel, Stepper } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

import { Link } from "react-router-dom";

import { OrderRoutePath } from "../../routes/order-route-path";

export const OrderStepper: FunctionComponent = () => {
  const { t } = useTranslation();
  let { path } = useRouteMatch();
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (path.includes(OrderRoutePath.Delivery)) {
      setActiveStep(0);
    } else if (path.includes(OrderRoutePath.Confirmation)) {
      setActiveStep(1);
    } else if (path.includes(OrderRoutePath.OrderHistory)) {
      setActiveStep(3);
    } else {
      setActiveStep(2);
    }
  }, [path]);

  return (
    <Stepper alternativeLabel activeStep={activeStep}>
      <Step key={OrderRoutePath.Delivery}>
        <StepLabel><Link to='/order/'>{t("order.delivery")}</Link></StepLabel>
      </Step>
      <Step key={OrderRoutePath.Confirmation}>
        <StepLabel>{t("order.confirmation")}</StepLabel>
      </Step>
      <Step key={OrderRoutePath.OrderHistory}>
        <StepLabel><Link to='/order/order-history'>{t("order.order-history")}</Link></StepLabel>
      </Step>
    </Stepper>
  );
};
