import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  PaginationModel
} from 'src/core';

@Component({
  selector: 'app-pagination-controller',
  templateUrl: './pagination-controller.component.html',
  styleUrls: ['./pagination-controller.component.scss']
})
export class PaginationControllerComponent implements OnInit {
  @Input() paginator: PaginationModel<any> = new PaginationModel();
  @Input() pageLimit: number | undefined = undefined;
  @Input() scrollToTop: boolean = false;
  @Output() page: EventEmitter<number> = new EventEmitter();
  private get _totalPages(): number {
    if (this.pageLimit &&
        (this.pageLimit > 0) &&
        (this.pageLimit < this.paginator.totalPages)) {
      return this.pageLimit;
    } else {
      return this.paginator.totalPages;
    }
  }

  public get isFirstPage(): boolean {
    return this.paginator.page === 0;
  }

  public get isLastPage(): boolean {
    return (this._totalPages > 0) ? (this.paginator.page === (this._totalPages - 1)) : true;
  }

  public get pageIndicator(): string {
    let currentPage = this.paginator.page;
    (this._totalPages > 0) ? (currentPage++) : null
    return `${currentPage} / ${this._totalPages}`;
  }

  constructor() {}

  ngOnInit(): void {
  }

  public goToFirstPage(): void {
    if (!this.isFirstPage) {
      this._goToPage(0);
    }
  }

  public goToPreviousPage(): void {
    if (!this.isFirstPage) {
      this._goToPage(this.paginator.page - 1);
    }
  }

  public goToNextPage(): void {
    if (!this.isLastPage) {
      this._goToPage(this.paginator.page + 1);
    }
  }

  public goToLastPage(): void {
    if (!this.isLastPage) {
      this._goToPage(this._totalPages - 1);
    }
  }

  private _goToPage(pageIndex: number): void {
    if (this.scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.page.emit(pageIndex);
  }
}
