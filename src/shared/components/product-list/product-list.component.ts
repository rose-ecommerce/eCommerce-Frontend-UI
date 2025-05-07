import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationModel, ProductModel } from 'src/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Input() paginator: PaginationModel<ProductModel> = new PaginationModel();
  @Input() pageLimit: number | undefined = undefined;
  @Input() scrollToTop: boolean = false;
  @Output() page: EventEmitter<number> = new EventEmitter();
  @Output() addToCart: EventEmitter<ProductModel> = new EventEmitter();

  constructor() {}

  public goToPage(pageIndex: number): void {
    this.page.emit(pageIndex);
  }

  public addProductToCart(product: ProductModel): void {
    this.addToCart.emit(product)
  }

}
