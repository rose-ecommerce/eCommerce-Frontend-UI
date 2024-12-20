import {
  BASE_SORTABLE_COLUMN
} from './common.constants';

export const MIN_ORDERABLE_QTY = 1;

export const ACCEPTED_CURRENCY = 'INR';

/**
 * Minimum purchase amount for no shipping charge.
 */
export const NO_SHIPPING_CHARGE_THRESHOLD = 700;

/**
 * In INR
 */
export const SHIPPING_CHARGE = 0;

/**
 * INR 1 = 100 paise
 */
export const INR_SUBUNIT = 100;

export const ORDER_SORTABLE_COLUMN = {
  ...BASE_SORTABLE_COLUMN,
  totalAmount: 'totalAmount',
} as const;
