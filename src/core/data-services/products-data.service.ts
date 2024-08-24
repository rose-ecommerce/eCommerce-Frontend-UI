import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';
import {
  environment
} from 'src/environments/environment';
import {
  ProductFilterCriteriaModel
} from '../models';
import {
  Injectable
} from '@angular/core';
import {
  ApiResponseInterface,
  PaginationInterface,
  ProductInterface
} from '../interfaces';

@Injectable()
export class ProductsDataService {
  private readonly API_URL: string = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  public getProducts(filterCriteria: ProductFilterCriteriaModel): Observable<ApiResponseInterface<PaginationInterface<ProductInterface>>> {
    const params = this._getQueryParamsForProductFilter(filterCriteria);
    return this._http.get<ApiResponseInterface<PaginationInterface<ProductInterface>>>(
      this.API_URL + '/products',
      { params }
    );
  }

  public getProductsWithIds(productIds: Array<string>): Observable<ApiResponseInterface<Array<ProductInterface>>> {
    return this._http.post<ApiResponseInterface<Array<ProductInterface>>>(
      this.API_URL + '/products/with-ids',
      productIds
    );
  }

  public getProduct(productId: string): Observable<ApiResponseInterface<ProductInterface>> {
    return this._http.get<ApiResponseInterface<ProductInterface>>(
      this.API_URL + `/products/${productId}`);
  }

  public editProductBasicDetails(productId: string, data: Record<string, any>): Observable<ApiResponseInterface<ProductInterface>> {
    return this._http.put<ApiResponseInterface<ProductInterface>>(
      this.API_URL + `/products/${productId}/basic-details`,
      data
    );
  }

  public addNewProductImage(productId: string, imageData: FormData): Observable<ApiResponseInterface<ProductInterface>> {
    return this._http.post<ApiResponseInterface<ProductInterface>>(
      this.API_URL + `/products/${productId}/images`,
      imageData
    );
  }

  public deleteProductImage(productId: string, imageId: string): Observable<ApiResponseInterface<ProductInterface>> {
    return this._http.delete<ApiResponseInterface<ProductInterface>>(
      this.API_URL + `/products/${productId}/images/${imageId}`,
    );
  }

  public deleteProduct(productId: string): Observable<ApiResponseInterface<ProductInterface>> {
    return this._http.delete<ApiResponseInterface<ProductInterface>>(
      this.API_URL + `/products/${productId}`,
    );
  }

  public reaggangeProductImages(productId: string, imageIds: Array<string>): Observable<ApiResponseInterface<ProductInterface>> {
    return this._http.put<ApiResponseInterface<ProductInterface>>(
      this.API_URL + `/products/${productId}/images`,
      imageIds
    );
  }

  public updateSimilarProducts(productId: string, similarProducts: Array<string>): Observable<ApiResponseInterface<ProductInterface>> {
    return this._http.put<ApiResponseInterface<ProductInterface>>(
      this.API_URL + `/products/${productId}/similar-products`,
      similarProducts
    );
  }

  public createProduct(productData: FormData): Observable<ApiResponseInterface<ProductInterface>> {
    return this._http.post<ApiResponseInterface<ProductInterface>>(
      this.API_URL + '/products',
      productData
    );
  }

  private _getQueryParamsForProductFilter(filterCriteria: ProductFilterCriteriaModel): HttpParams {
    let params = new HttpParams()
      .set('size', filterCriteria.size)
      .set('page', filterCriteria.page)
      .set('sort', `${filterCriteria.sortColumn},${filterCriteria.sortDirection}`);

    if (filterCriteria.category !== undefined) {
      params = params.set('category', filterCriteria.category);
    }

    if (filterCriteria.isPinned !== undefined) {
      params = params.set('isPinned', filterCriteria.isPinned);
    }

    if (filterCriteria.search) {
      params = params.set('search', filterCriteria.search);
    }

    return params;
  }
}
