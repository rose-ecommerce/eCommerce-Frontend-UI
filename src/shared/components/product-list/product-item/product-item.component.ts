import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ProductModel
} from 'src/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
  private readonly IMG_SHUFFLE_EDELAY: number = 700;
  private _imgTimeoutId: any;
  @Input() product: ProductModel = new ProductModel();
  @Output() addToCart: EventEmitter<ProductModel> = new EventEmitter();

  constructor(private _router: Router) {}

  public changeDisplayImage(product: ProductModel): void {
    if (product.images.length > 1) {
      this._imgTimeoutId = setTimeout(() => {
        product.displayImage = product.images[1];
      }, this.IMG_SHUFFLE_EDELAY)
    }
  }

  public resetDisplayImage(product: ProductModel): void {
    clearTimeout(this._imgTimeoutId);
    product.displayImage = product.images[0];
  }

  public viewProduct(): void {
    this._router.navigate(['products', this.product._id]);
  }

  public addProductToCard(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}
