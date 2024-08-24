import {
  Injectable
} from '@angular/core';
import {
  ProductsDataService
} from '../data-services';
import {
  LoadingHelperService,
  NotificationHelperService,
  ProductHelperService
} from '../helper-services';
import {
  HttpErrorResponse
} from '@angular/common/http';
import {
  catchError,
  finalize,
  forkJoin,
  mergeMap,
  of,
  take,
  tap
} from 'rxjs';
import {
  ProductFilterCriteriaModel,
  PaginationModel,
  ProductModel,
} from '../models';
import {
  ProductLoaderService
} from '../loader-services';
import {
  ProductPaginationType
} from '../enums';

@Injectable()
export class ProductsBrokerService {

  constructor(private _productsData: ProductsDataService,
              private _productLoader: ProductLoaderService,
              private _productHelper: ProductHelperService,
              private _notificationHelper: NotificationHelperService,
              private _loadingHelper: LoadingHelperService) { }

  public getProducts(filterCriteria: ProductFilterCriteriaModel,
                     paginationType: ProductPaginationType = ProductPaginationType.GENERAL): void {
    this._loadingHelper.startLoading();
    let pagination: PaginationModel<ProductModel> = new PaginationModel();
    this._productsData.getProducts(filterCriteria)
      .pipe(
        take(1),
        tap(res => {
          pagination = new PaginationModel(res.data);
          pagination.content = this._productHelper.transformProducts(pagination.content);
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificationHelper.handleError(err.error.message)
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
          switch (paginationType) {
            case ProductPaginationType.GENERAL:
              this._productLoader.pagination = pagination;
              break;
            case ProductPaginationType.PINNED:
              this._productLoader.pinnedPagination = pagination;
              break;
            case ProductPaginationType.LATEST:
              this._productLoader.latestPagination = pagination;
              break;
            case ProductPaginationType.POPULAR:
              this._productLoader.popularPagination = pagination;
              break;
            default:
              this._productLoader.pagination = pagination;
          }
        })
      )
      .subscribe();
  }

  public getProductsWithIds(productIds: Array<string>): void {
    this._loadingHelper.startLoading();
    let products: Array<ProductModel> = [];
    this._productsData.getProductsWithIds(productIds)
      .pipe(
        take(1),
        tap(res => {
          products = this._productHelper.transformProducts(res.data);
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificationHelper.handleError(err.error.message);
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
          this._productLoader.products = products;
        })
      )
      .subscribe();
  }

  public editProductBasicDetails(productId: string, data: Record<string, any>): void {
    this._loadingHelper.startLoading();
    let product: ProductModel = new ProductModel();
    this._productsData.editProductBasicDetails(productId, data)
      .pipe(
        take(1),
        mergeMap(res => {
          product = this._productHelper.transformProducts([res.data])[0];
          return this._productsData.getProductsWithIds(product.similarProducts);
        }),
        tap(res => {
          product.similarProducts = this._productHelper.transformProducts(res.data);
          this._productLoader.product = product;
          this._notificationHelper.handleSuccess('Product updated!');
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificationHelper.handleError(err.error.message);
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
        })
      )
      .subscribe();
  }

  public addNewProductImage(productId: string, imageData: FormData): void {
    this._loadingHelper.startLoading();
    let product: ProductModel = new ProductModel();
    this._productsData.addNewProductImage(productId, imageData)
      .pipe(
        take(1),
        mergeMap(res => {
          product = this._productHelper.transformProducts([res.data])[0];
          return this._productsData.getProductsWithIds(product.similarProducts);
        }),
        tap(res => {
          product.similarProducts = this._productHelper.transformProducts(res.data);
          this._productLoader.product = product;
          this._notificationHelper.handleSuccess('Product updated!');
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificationHelper.handleError(err.error.message);
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
        })
      )
      .subscribe();
  }

  public deleteProductImage(productId: string, imageId: string): void {
    this._loadingHelper.startLoading();
    let product: ProductModel = new ProductModel();
    this._productsData.deleteProductImage(productId, imageId)
      .pipe(
        take(1),
        mergeMap(res => {
          product = this._productHelper.transformProducts([res.data])[0];
          return this._productsData.getProductsWithIds(product.similarProducts);
        }),
        tap(res => {
          product.similarProducts = this._productHelper.transformProducts(res.data);
          this._productLoader.product = product;
          this._notificationHelper.handleSuccess('Product updated!');
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificationHelper.handleError(err.error.message);
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
        })
      )
      .subscribe();
  }

  public deleteProduct(productId: string): void {
    this._loadingHelper.startLoading();
    this._productsData.deleteProduct(productId)
      .pipe(
        take(1),
        tap(res => {
          this._productLoader.isProductDeleted = true;
          this._notificationHelper.handleSuccess('Product deleted!');
        }),
        catchError((err: HttpErrorResponse) => {
          this._productLoader.isProductDeleted = false;
          this._notificationHelper.handleError(err.error.message);
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
        })
      )
      .subscribe();
  }

  public rearrangeProductImages(productId: string, imageIds: Array<string>): void {
    this._loadingHelper.startLoading();
    let product: ProductModel = new ProductModel();
    this._productsData.reaggangeProductImages(productId, imageIds)
      .pipe(
        take(1),
        mergeMap(res => {
          product = this._productHelper.transformProducts([res.data])[0];
          return this._productsData.getProductsWithIds(product.similarProducts);
        }),
        tap(res => {
          product.similarProducts = this._productHelper.transformProducts(res.data);
          this._productLoader.product = product;
          this._notificationHelper.handleSuccess('Product updated!');
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificationHelper.handleError(err.error.message);
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
        })
      )
      .subscribe();
  }

  public updateSimilarProducts(productId: string, similarProductIds: Array<string>): void {
    this._loadingHelper.startLoading();
    let product: ProductModel = new ProductModel();
    this._productsData.updateSimilarProducts(productId, similarProductIds)
      .pipe(
        take(1),
        mergeMap(res => {
          product = this._productHelper.transformProducts([res.data])[0];
          return this._productsData.getProductsWithIds(product.similarProducts);
        }),
        tap(res => {
          product.similarProducts = this._productHelper.transformProducts(res.data);
          this._productLoader.product = product;
          this._notificationHelper.handleSuccess('Product updated!');
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificationHelper.handleError(err.error.message);
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
        })
      )
      .subscribe();
  }

  public createProduct(productData: FormData): void {
    this._loadingHelper.startLoading();
    let product: ProductModel = new ProductModel();
    this._productsData.createProduct(productData)
      .pipe(
        take(1),
        mergeMap(res => {
          product = this._productHelper.transformProducts([res.data])[0];
          return this._productsData.getProductsWithIds(product.similarProducts);
        }),
        tap(res => {
          product.similarProducts = this._productHelper.transformProducts(res.data);
          this._productLoader.product = product;
          this._notificationHelper.handleSuccess('Product created successfully!');
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificationHelper.handleError(err.error.message);
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
        })
      )
      .subscribe();
  }

  public getProduct(productId: string): void {
    this._loadingHelper.startLoading();
    let product: ProductModel = new ProductModel();
    this._productsData.getProduct(productId)
      .pipe(
        take(1),
        mergeMap(res => {
          product = this._productHelper.transformProducts([res.data])[0];
          return this._productsData.getProductsWithIds(product.similarProducts);
        }),
        tap(res => {
          product.similarProducts = this._productHelper.transformProducts(res.data);
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificationHelper.handleError(err.error.message)
          return of();
        }),
        finalize(() => {
          this._loadingHelper.stopLoading();
          this._productLoader.product = product;
        })
      )
      .subscribe();
  }

  public getInitialDataRequiredForHomePage(pinnedProductsFC: ProductFilterCriteriaModel,
                                           latestProductsFC: ProductFilterCriteriaModel,
                                           popularProductsFC: ProductFilterCriteriaModel): void {
    this._loadingHelper.startLoading();
    let pinnedPagination: PaginationModel<ProductModel> = new PaginationModel();
    let latestPagination: PaginationModel<ProductModel> = new PaginationModel();
    let popularPagination: PaginationModel<ProductModel> = new PaginationModel();
    forkJoin({
      pinned: this._productsData.getProducts(pinnedProductsFC),
      latest: this._productsData.getProducts(latestProductsFC),
      popular: this._productsData.getProducts(popularProductsFC)
    })
      .pipe(
      take(1),
      tap(res => {
        pinnedPagination = new PaginationModel(res.pinned.data);
        pinnedPagination.content = this._productHelper.transformProducts(pinnedPagination.content);

        latestPagination = new PaginationModel(res.latest.data);
        latestPagination.content = this._productHelper.transformProducts(latestPagination.content);

        popularPagination = new PaginationModel(res.popular.data);
        popularPagination.content = this._productHelper.transformProducts(popularPagination.content);
      }),
      catchError((err: HttpErrorResponse) => {
        this._notificationHelper.handleError(err.error.message);
        
        return of();
      }),
      finalize(() => {
        this._loadingHelper.stopLoading();
        this._productLoader.pinnedPagination = pinnedPagination;
        this._productLoader.latestPagination = latestPagination;
        this._productLoader.popularPagination = popularPagination;
      })
    )
    .subscribe();
  }
}
