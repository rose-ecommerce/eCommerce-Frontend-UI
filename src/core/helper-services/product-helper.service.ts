import {
  Injectable
} from '@angular/core';
import {
  ProductImageModel,
  ProductModel
} from '../models';
import {
  environment
} from 'src/environments/environment';
import {
  ProductImageInterface,
  ProductInterface
} from '../interfaces';
import {
  ProductImageStorageLocation
} from '../enums';

@Injectable()
export class ProductHelperService {
  private readonly BASE_URL: string = environment.baseUrl;

  constructor() { }

  public transformProducts(products: Array<ProductInterface>): Array<ProductModel> {
    return products.map(data => {
      const product = new ProductModel(data);
      product.images = this.transformProductImages(product.images);
      product.displayImage = product.images[0];
      return product;
    })
  }

  public transformProductImages(productImages: Array<ProductImageInterface>): Array<ProductImageModel> {
    return productImages.map(data => {
      const img = new ProductImageModel(data);
      if (!img.storageLocation || (img.storageLocation === ProductImageStorageLocation.LOCAL)) {
        img.url = this.BASE_URL + img.url;
      }
      return img;
    });
  }
}
