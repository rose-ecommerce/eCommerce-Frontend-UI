import {
  NgModule
} from '@angular/core';
import {
  AuthBrokerService,
  OrderBrokerService,
  ProductsBrokerService, 
  StallScheduleBrokerService, 
  UserBrokerService
} from './broker-services';
import {
  AuthDataService,
  OrderDataService,
  ProductsDataService,
  StallScheduleDataService,
  UserDataService
} from './data-services';
import {
  AuthHelperService,
  CartHelperService,
  LoadingHelperService,
  NotificationHelperService,
  OrderHelperService,
  ProductHelperService,
  RazorpayHelperService,
  StallScheduleHelperService,
  UserHelperService,
  ScreenResizeHelperService
} from './helper-services';
import {
  AdminGuard,
  AuthGuard,
  ModGuard,
} from './guards';
import {
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  RequestInterceptor,
  ResponseInterceptor
} from './interceptors';
import {
  AuthLoaderService,
  OrderLoaderService,
  ProductLoaderService,
  StallScheduleLoaderService,
  UserLoaderService
} from './loader-services';



@NgModule({
  providers: [
    AuthBrokerService,
    ProductsBrokerService,
    OrderBrokerService,
    UserBrokerService,
    StallScheduleBrokerService,

    AuthLoaderService,
    ProductLoaderService,
    OrderLoaderService,
    UserLoaderService,
    StallScheduleLoaderService,

    AuthDataService,
    ProductsDataService,
    OrderDataService,
    UserDataService,
    StallScheduleDataService,

    ProductHelperService,
    OrderHelperService,
    UserHelperService,
    AuthHelperService,
    NotificationHelperService,
    LoadingHelperService,
    CartHelperService,
    RazorpayHelperService,
    StallScheduleHelperService,
    ScreenResizeHelperService,

    AuthGuard,
    AdminGuard,
    ModGuard,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
