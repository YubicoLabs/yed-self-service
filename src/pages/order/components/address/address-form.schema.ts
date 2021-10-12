import { TFunction } from "i18next";
import { object, string } from "yup";

export const addressFormSchema = (t: TFunction) => {
  return object().shape({
    firstName: string()
      .required(
        t("errorMessages.required", { fieldName: t("address.firstName") })
      )
      .max(15, t("errorMessages.tooLong", { max: 15 })),
    lastName: string()
      .required(
        t("errorMessages.required", { fieldName: t("address.lastName") })
      )
      .max(20, t("errorMessages.tooLong", { max: 20 })),
    addressLine1: string()
      .required(
        t("errorMessages.required", { fieldName: t("address.addressLine1") })
      )
      .max(60, t("errorMessages.tooLong", { max: 60 })),
    addressLine2: string().notRequired(),
    city: string()
      .required(
        t("errorMessages.required", { fieldName: t("address.addressLine2") })
      )
      .max(60, t("errorMessages.tooLong", { max: 60 })),
    provinceState: string()
      .required(
        t("errorMessages.required", { fieldName: t("address.provinceState") })
      )
      .max(50, t("errorMessages.tooLong", { max: 50 })),
    country: string()
      .required(
        t("errorMessages.required", { fieldName: t("address.country") })
      )
      .max(2, t("errorMessages.tooLong", { max: 2 })),
    zipPostalCode: string()
      .required(
        t("errorMessages.required", { fieldName: t("address.zipPostalCode") })
      )
      .min(5, t("errorMessages.tooShort", { min: 5 }))
      .max(7, t("errorMessages.tooLong", { max: 7 })),
  });
};
