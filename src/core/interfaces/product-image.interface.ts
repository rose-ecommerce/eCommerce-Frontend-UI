import {
  ProductImageStorageLocation
} from '../enums';

export interface ProductImageInterface {
  _id: string;
  url: string;
  storageLocation: ProductImageStorageLocation;
  whenCreated: number;
  whenLastUpdated: number;
};
