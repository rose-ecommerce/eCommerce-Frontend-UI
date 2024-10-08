import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { takeWhile } from 'rxjs';
import {
  ProductCategory,
  ScreenResizeHelperService
} from 'src/core';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit, OnDestroy {
  @Input() categoryName: ProductCategory = ProductCategory.OTHERS;
  @Output() filterByCategory: EventEmitter<ProductCategory> = new EventEmitter();
  private _subscribeMain: boolean = true;
  public isSmallScreenReached: boolean = false;

  constructor(private _screenResizeHelper: ScreenResizeHelperService) {}

  ngOnInit(): void {
    this._initSubscriptipon();
  }

  ngOnDestroy(): void {
    this._subscribeMain = false;
  }

  private _initSubscriptipon(): void {
    this._screenResizeHelper.screenWidth$
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(width => {
        this.isSmallScreenReached = (width <= 500);
      });
  }

  public onClickCard(): void {
    this.filterByCategory.emit(this.categoryName);
  }
}
