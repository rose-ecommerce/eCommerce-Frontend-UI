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
  ProductImageModel,
  ScreenResizeHelperService
} from 'src/core';

@Component({
  selector: 'app-product-image-carousel',
  templateUrl: './product-image-carousel.component.html',
  styleUrls: ['./product-image-carousel.component.scss']
})
export class ProductImageCarouselComponent implements OnInit, OnDestroy {
  @Input() carouselDisplayImage: ProductImageModel = new ProductImageModel();
  @Input() carouselImages: Array<ProductImageModel> = [];

  @Input() isCarouselOpen: boolean = false;
  @Output() isCarouselOpenChange: EventEmitter<boolean> = new EventEmitter();

  public carouselImageHeight!: string;
  private _subscribeMain = true;

  constructor(private _screenResizeHelper: ScreenResizeHelperService) {}

  ngOnInit(): void {
    this._initSubscriptions();
  }

  ngOnDestroy(): void {
    this._subscribeMain = false;
  }

  private _initSubscriptions(): void {
    this._screenResizeHelper.screenWidth$
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(width => {
        /*
         * 800 is the width of the carousel image.
         */
        if (width <= 800) {
          this.carouselImageHeight = `${width}px`;
        } else {
          this.carouselImageHeight = '801px';
        }
      });
  }

  public closeCarousel(): void {
    this.isCarouselOpenChange.emit(false);
  }

  public prevImage(): void {
    const displayImageIndex = this._getImageIndex(this.carouselDisplayImage._id);
    if (displayImageIndex !== 0) {
      this.setAsDisplayImage(this.carouselImages[displayImageIndex - 1]);
    }
  }

  public nextImage(): void {
    const displayImageIndex = this._getImageIndex(this.carouselDisplayImage._id);
    if (displayImageIndex !== (this.carouselImages.length - 1)) {
      this.setAsDisplayImage(this.carouselImages[displayImageIndex + 1]);
    }
  }

  public setAsDisplayImage(image: ProductImageModel): void {
    this.carouselDisplayImage = image;
  }

  private _getImageIndex(imageId: string): number {
    return this.carouselImages.findIndex(img => img._id === imageId);
  }

  public isImageDisplayed(image: ProductImageModel): boolean {
    return image._id === this.carouselDisplayImage._id;
  }
}
