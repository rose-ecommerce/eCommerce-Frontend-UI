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
  mergeMap,
  takeWhile
} from 'rxjs';
import {
  AuthHelperService,
  CartHelperService,
  PRODUCT_CUSTOMIZATION_TEXT_FORMAT,
  ProductImageModel,
  ProductLoaderService,
  ProductModel,
  ProductsBrokerService,
  ScreenResizeHelperService
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
  public primaryImageHeight!: string;
  public secondaryImageHeight!: string;

  constructor(private _route: ActivatedRoute,
              private _productsBroker: ProductsBrokerService,
              private _productLoader: ProductLoaderService,
              private _cartHelper: CartHelperService,
              private _authHelper: AuthHelperService,
              private _screenResizeHelper: ScreenResizeHelperService,
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
      .pipe(
        takeWhile(() => this._subscribeMain),
        mergeMap(product => {
          this.product = product;
          this._createCustomTextForm();
          return this._screenResizeHelper.screenWidth$;
        })
      )
      .subscribe(width => {
        if (width <= 560) {
          this.primaryImageHeight = `${width - (2 * 24)}px`;
          const numberOfImagesOfProduct: number = this.product.images.length;
          switch(numberOfImagesOfProduct) {
            case 3:
              this.secondaryImageHeight = `${(width - (2 * 24) - (2 * 16)) / numberOfImagesOfProduct}px`
              break;
            case 2:
              if (width <= 384) {
                this.secondaryImageHeight = `${(width - (2 * 24) - 16) / numberOfImagesOfProduct}px`
              } else {
                this.secondaryImageHeight = '160px';
              }
              break;
          }
        } else {
          this.primaryImageHeight = '512px';
          this.secondaryImageHeight = '160px';
        }
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
    if (confirm('Are you sure you want to delete this product? Please check whether the product is placed for the order. Once the product is deleted, it cannot be retrieved!')) {
      const result = prompt(`To confirm, type "${this.product.name}" in the box below`);
      if (result === this.product.name) {
        this._productsBroker.deleteProduct(this.product._id);
      } else {
        alert(`Input incorrect, please try again.`);
      }
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
