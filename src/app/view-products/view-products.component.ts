import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  takeWhile
} from 'rxjs';
import {
  CartHelperService,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  ProductFilterCriteriaModel,
  PaginationModel,
  ProductLoaderService,
  ProductModel,
  ProductsBrokerService
} from 'src/core';
import {
  CapitalizePipe
} from 'src/shared/pipes';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss'],
  providers: [ CapitalizePipe ]
})
export class ViewProductsComponent implements OnInit, OnDestroy {
  private _subscribeMain: boolean = true;
  public pagination: PaginationModel<ProductModel> = new PaginationModel();
  private _filter: ProductFilterCriteriaModel = new ProductFilterCriteriaModel({
    page: DEFAULT_PAGE_INDEX,
    size: DEFAULT_PAGE_SIZE
  });
  public header: string = '';

  constructor(private _productsBroker: ProductsBrokerService,
              private _productLoader: ProductLoaderService,
              private _cartHelper: CartHelperService,
              private _capitalizePipe: CapitalizePipe,
              private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._initSubscription();
  }

  ngOnDestroy(): void {
    this._subscribeMain = false;
  }

  private _initSubscription(): void {
    this._productLoader.pagination$
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(pagination => {
        this.pagination = pagination;
      });

    this._route.queryParams
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(query => {
        const selectedCategory = query?.['category'];
        const searchedText = query?.['search'];

        if (selectedCategory && searchedText) {
          this.header = `${this._capitalizePipe.transform(selectedCategory, '_')} > ${searchedText}`;
        } else if (selectedCategory) {
          this.header = this._capitalizePipe.transform(selectedCategory, '_');
        } else if (searchedText) {
          this.header = `Search: ${searchedText}`;
        }

        this._filter.category = selectedCategory;
        this._filter.search = searchedText;

        this._getProducts();
      });
  }

  public switchPage(pageIndex: number): void {
    this._filter.page = pageIndex;
    this._getProducts();
  }

  private _getProducts(): void {
    this._productsBroker.getProducts(this._filter);
  }

  public addProductToCart(product: ProductModel): void {
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
}
