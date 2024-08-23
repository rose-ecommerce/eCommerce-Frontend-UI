import {
  ProductImageStorageLocation
} from '../enums';
import {
  ProductImageInterface
} from '../interfaces';

export class ProductImageModel implements ProductImageInterface {
  _id: string;
  url: string;
  storageLocation: ProductImageStorageLocation;
  whenCreated: number;
  whenLastUpdated: number;
  constructor(data: Partial<ProductImageInterface> | Partial<ProductImageModel> = {
    _id: '',
    url: '',
    storageLocation: ProductImageStorageLocation.LOCAL,
    whenCreated: Date.now(),
    whenLastUpdated: Date.now(),
  }) {
    this._id = data?._id || '';
    this.url = data?.url || '';
    this.storageLocation = data?.storageLocation || ProductImageStorageLocation.LOCAL;
    this.whenCreated = data?.whenCreated || Date.now();
    this.whenLastUpdated = data?.whenLastUpdated || Date.now();
  }
};
