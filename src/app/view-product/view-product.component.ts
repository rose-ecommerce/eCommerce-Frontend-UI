import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, of, takeWhile } from 'rxjs';
import { CartHelperService, ProductImageModel, ProductModel, ProductsBrokerService } from 'src/core';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit, OnDestroy {
  public product: ProductModel = new ProductModel();
  private _subscribeMain: boolean = true;
  public get productQtyInCart(): number { return this._cartHelper.getProductQtyInCart(this.product); }
  constructor(private _route: ActivatedRoute,
              private _productsBroker: ProductsBrokerService,
              private _cartHelper: CartHelperService) {}

  ngOnInit(): void {
    this._initSubscriptions();
  }

  ngOnDestroy(): void {
    this._subscribeMain = false;
  }

  private _initSubscriptions(): void {
    this._route.params
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(params => {
        this._productsBroker.getProduct(params['id']);
      });

    this._productsBroker.product$
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(product => {
        this.product = product;
      });
  }

  public getImagePath(baseImgPath: string): string {
    return `url('${ baseImgPath }')`;
  }

  public setAsDisplayImage(image: ProductImageModel): void {
    this.product.displayImage = image;
  }

  public isImageDisplayed(image: ProductImageModel): boolean {
    return image._id === this.product.displayImage._id;
  }

  public addProduct(qty: number): void {
    this._cartHelper.addProduct(this.product, qty);
  }

  public subtractProduct(qty: number): void {
    this._cartHelper.subtractProduct(this.product, qty);
  }

  public addSimilarProductToCart(product: ProductModel): void {
    this._cartHelper.addProduct(product, 1);
  }
}
