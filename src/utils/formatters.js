import { currencyConfig } from "../config/storeConfig";

export const formatter = new Intl.NumberFormat(currencyConfig.locale, {
  style: "currency",
  currency: currencyConfig.currency,
  maximumFractionDigits: 0,
});
