import {
  BASE_SORTABLE_COLUMN
} from './common.constants';

export const MIN_IMAGES_PER_PRODUCT: number = 1;

export const PRODUCT_NAME_LENGTH_RANGE = {
  MIN: 3,
  MAX: 200
} as const;

export const PRODUCT_DESCRIPTION_LENGTH_RANGE = {
  MIN: 5,
  MAX: 1000
} as const;

export const PRODUCT_CUSTOMIZATION_TEXT_FORMAT_OLD = /^[A-Z0-9]+$/;

export const PRODUCT_CUSTOMIZATION_TEXT_FORMAT = /^[A-Za-z0-9]+(?: & [A-Za-z0-9]+)?$/;

export const PRODUCT_SORTABLE_COLUMN = {
  ...BASE_SORTABLE_COLUMN,
  sellingPrice: 'sellingPrice',
  totalPurchases: 'totalPurchases',
} as const;
