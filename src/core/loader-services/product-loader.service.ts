import {
  Injectable
} from '@angular/core';
import {
  Observable,
  Subject
} from 'rxjs';
import {
  PaginationModel,
  ProductModel
} from '../models';

@Injectable()
export class ProductLoaderService {
  /**
   * Following is more general pagination subject. Can be used inside component which required only
   * one pagination data.
   */
  private _pagination$: Subject<PaginationModel<ProductModel>> = new Subject();
  public pagination$: Observable<PaginationModel<ProductModel>> =  this._pagination$.asObservable();

  /**
   * Following subject is created only for serving HomeComponent. Since HomeComponent require more
   * than one pagination data.
   */
  private _pinnedPagination$: Subject<PaginationModel<ProductModel>> = new Subject();
  public pinnedPagination$: Observable<PaginationModel<ProductModel>> = this._pinnedPagination$.asObservable();

  /**
   * Following subject is created only for serving HomeComponent. Since HomeComponent require more
   * than one pagination data.
   */
  private _latestPagination$: Subject<PaginationModel<ProductModel>> = new Subject();
  public latestPagination$: Observable<PaginationModel<ProductModel>> = this._latestPagination$.asObservable();

  /**
   * Following subject is created only for serving HomeComponent. Since HomeComponent require more
   * than one pagination data.
   */
  private _popularPagination$: Subject<PaginationModel<ProductModel>> = new Subject();
  public popularPagination$: Observable<PaginationModel<ProductModel>> = this._popularPagination$.asObservable();

  private _product$: Subject<ProductModel> = new Subject();
  public product$: Observable<ProductModel> = this._product$.asObservable();

  private _products$: Subject<Array<ProductModel>> = new Subject();
  public products$: Observable<Array<ProductModel>> = this._products$.asObservable();

  private _isProductDeleted$: Subject<boolean> = new Subject();
  public isProductDeleted$: Observable<boolean> = this._isProductDeleted$.asObservable();

  constructor() { }

  public set pagination(data: PaginationModel<ProductModel>) {
    this._pagination$.next(data);
  }

  public set pinnedPagination(data: PaginationModel<ProductModel>) {
    this._pinnedPagination$.next(data);
  }

  public set latestPagination(data: PaginationModel<ProductModel>) {
    this._latestPagination$.next(data);
  }

  public set popularPagination(data: PaginationModel<ProductModel>) {
    this._popularPagination$.next(data);
  }

  public set product(data: ProductModel) {
    this._product$.next(data);
  }

  public set isProductDeleted(data: boolean) {
    this._isProductDeleted$.next(data);
  }

  public set products(data: Array<ProductModel>) {
    this._products$.next(data);
  }
}
