import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  takeWhile
} from 'rxjs';
import {
  AuthHelperService,
  CartHelperService,
  PRODUCT_CUSTOMIZATION_TEXT_FORMAT,
  ProductImageModel,
  ProductLoaderService,
  ProductModel,
  ProductsBrokerService
} from 'src/core';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit, OnDestroy {
  public product: ProductModel = new ProductModel();
  public carouselDisplayImage: ProductImageModel = new ProductImageModel();
  public carouselImages: Array<ProductImageModel> = [];
  public customizationTextFC!: FormControl;
  private _subscribeMain: boolean = true;
  public isCarouselOpen: boolean = false;
  public get productQtyInCart(): number {
    return this._cartHelper.getProductQtyInCart(this.product._id);
  }
  public get customizationTextOfProductInCart(): string {
    return this._cartHelper.getCustomizationTextOfProductInCart(this.product._id);
  }
  public get canEditProduct(): boolean {
    return this._authHelper.isLoggedIn && this._authHelper.isLoggedInUserAdminOrMod;
  }
  public get canDeleteProduct(): boolean {
    return this._authHelper.isLoggedIn && this._authHelper.isLoggedInUserAdmin;
  }
  public get isDiscountAvailable(): boolean {
    return this.product.maxRetailPrice > this.product.sellingPrice;
  }
  public get discountPercentage(): string {
    const ratio: number = (this.product.maxRetailPrice - this.product.sellingPrice) / this.product.maxRetailPrice;
    const percentage: number = Math.floor(ratio * 100);
    return `-${percentage}%`;
  }
  public get customTextValidationClasses(): Record<string, boolean> {
    return {
      'is-invalid': (this.customizationTextFC.touched || this.customizationTextFC.dirty) && !!this.customizationTextFC.errors,
      'is-valid': (this.customizationTextFC.touched || this.customizationTextFC.dirty) && !this.customizationTextFC.errors
     };
  }
  public get isProductCustomizable(): boolean {
    return !(this.product.customizationTextRange.min === 0 &&
           this.product.customizationTextRange.max === 0)
  }
  public get isCustomTextEdited(): boolean {
    return this.customizationTextFC?.touched || this.customizationTextFC?.dirty;
  }
  public get isProductOutOfStock(): boolean {
    return this.product.quantityInStock <= 0;
  }
  public get isProductAddable(): boolean {
    return ((this.isProductCustomizable &&
           this.customizationTextFC.valid) ||
           !this.isProductCustomizable)
           
  }
  public get canUpdateCustomizationText(): boolean {
    return (this.productQtyInCart > 0) &&
           this.customizationTextFC.valid &&
           (this.customizationTextFC?.value !== this.customizationTextOfProductInCart);
  }
  constructor(private _route: ActivatedRoute,
              private _productsBroker: ProductsBrokerService,
              private _productLoader: ProductLoaderService,
              private _cartHelper: CartHelperService,
              private _authHelper: AuthHelperService,
              private _router: Router) {}

  ngOnInit(): void {
    this._initSubscriptions();
  }

  ngOnDestroy(): void {
    this._subscribeMain = false;
  }

  private _createCustomTextForm(): void {
    this.customizationTextFC = new FormControl(
      {
        value: this.customizationTextOfProductInCart,
        disabled: this.isProductOutOfStock
      },
      [
        Validators.required,
        Validators.minLength(this.product.customizationTextRange.min),
        Validators.maxLength(this.product.customizationTextRange.max),
        Validators.pattern(PRODUCT_CUSTOMIZATION_TEXT_FORMAT)
      ]
    );
  }

  private _initSubscriptions(): void {
    this._route.params
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(params => {
        this._productsBroker.getProduct(params['id']);
      });

    this._productLoader.product$
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(product => {
        this.product = product;
        this._createCustomTextForm();
      });

    this._productLoader.isProductDeleted$
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(isDeleted => {
        if (isDeleted) {
          this._router.navigate(['../'], {
            relativeTo: this._route
          });
        }
      });
  }

  public setAsDisplayImage(image: ProductImageModel): void {
    this.product.displayImage = image;
  }

  public isImageDisplayed(image: ProductImageModel): boolean {
    return image._id === this.product.displayImage._id;
  }

  public addProduct(qtyToAdd: number): void {
    this._cartHelper.addProduct(
      this.product._id,
      this.product.quantityInStock,
      qtyToAdd,
      this.customizationTextFC.value
    );
  }

  public subtractProduct(qtyToSubtract: number): void {
    this._cartHelper.subtractProduct(this.product._id, qtyToSubtract);
  }

  public addSimilarProductToCart(product: ProductModel): void {
    if (product.customizationTextRange.min === 0 &&
        product.customizationTextRange.max === 0) {
      this._cartHelper.addProduct(
        product._id,
        product.quantityInStock,
        1,
        ''
      );
    }
  }

  public editProduct(): void {
    this._router.navigate(['edit'], {
      relativeTo: this._route,
    })
  }

  public deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product? Once deleted it cannot be retrieved!')) {
      this._productsBroker.deleteProduct(this.product._id);
    }
  }

  public openCarousel(): void {
    this.carouselDisplayImage = new ProductImageModel(this.product.displayImage);
    this.carouselImages = this.product.images.map(img => new ProductImageModel(img));
    this.isCarouselOpen = true;
  }

  public updateCustomizationText(): void {
    this._cartHelper.updateCustomizationTextOfProductInCart(
      this.product._id,
      this.customizationTextFC.value
    )
  }

}
