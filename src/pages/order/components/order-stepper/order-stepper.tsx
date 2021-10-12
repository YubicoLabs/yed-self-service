import { Step, StepLabel, Stepper } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

import { OrderRoutePath } from "../../routes/order-route-path";

export const OrderStepper: FunctionComponent = () => {
  const { t } = useTranslation();
  let { path } = useRouteMatch();
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (path.includes(OrderRoutePath.Delivery)) {
      setActiveStep(0);
    } else {
      setActiveStep(1);
    }
  }, [path]);

  return (
    <Stepper alternativeLabel activeStep={activeStep}>
      <Step key={OrderRoutePath.Delivery}>
        <StepLabel>{t("order.delivery")}</StepLabel>
      </Step>
      <Step key={OrderRoutePath.OrderHistory}>
        <StepLabel>{t("order.order-history")}</StepLabel>
      </Step>
    </Stepper>
  );
};
