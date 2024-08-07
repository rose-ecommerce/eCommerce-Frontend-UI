import {
  Injectable
} from '@angular/core';
import {
  environment
} from 'src/environments/environment';
import {
  ApiResponseInterface,
  OrderInterface,
  PaginationInterface
} from '../interfaces';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';
import {
  OrderFilterCriteriaModel,
  OrderModel
} from '../models';

@Injectable()
export class OrderDataService {
  private readonly API_URL: string = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  public createOrder(purchases: OrderModel): Observable<ApiResponseInterface<OrderInterface>> {
    return this._http.post<ApiResponseInterface<OrderInterface>>(
      this.API_URL + '/orders',
      purchases
    );
  }

  public updateOrderBasicDetails(orderId: string, basicDetails: OrderModel): Observable<ApiResponseInterface<OrderInterface>> {
    return this._http.put<ApiResponseInterface<OrderInterface>>(
      this.API_URL + `/orders/${orderId}/basic-details`,
      basicDetails
    );
  }

  public getOrder(orderId: string): Observable<ApiResponseInterface<OrderInterface>> {
    return this._http.get<ApiResponseInterface<OrderInterface>>(
      this.API_URL + `/orders/${orderId}`,
    );
  }

  public getOrders(filterCriteria: OrderFilterCriteriaModel): Observable<ApiResponseInterface<PaginationInterface<OrderInterface>>> {
    const params = this._getQueryParamsForOrderFilter(filterCriteria);
    return this._http.get<ApiResponseInterface<PaginationInterface<OrderInterface>>>(
      this.API_URL + `/orders`,
      { params }
    );
  }

  public getOrdersOfUser(userId: string, filterCriteria: OrderFilterCriteriaModel): Observable<ApiResponseInterface<PaginationInterface<OrderInterface>>> {
    const params = this._getQueryParamsForOrderFilter(filterCriteria);
    return this._http.get<ApiResponseInterface<PaginationInterface<OrderInterface>>>(
      this.API_URL + `/users/${userId}/orders`,
      { params }
    );
  }

  private _getQueryParamsForOrderFilter(filterCriteria: OrderFilterCriteriaModel): HttpParams {
    let params = new HttpParams()
      .set('size', filterCriteria.size)
      .set('page', filterCriteria.page)
      .set('sort', `${filterCriteria.sortColumn},${filterCriteria.sortDirection}`);

    if (filterCriteria.status !== undefined) {
      params = params.set('status', filterCriteria.status);
    }

    return params;
  }

}
