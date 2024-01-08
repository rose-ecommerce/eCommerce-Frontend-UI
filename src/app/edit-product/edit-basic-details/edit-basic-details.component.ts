import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  takeWhile
} from 'rxjs';
import {
  ProductCategory,
  ProductModel,
  ProductsBrokerService
} from 'src/core';
import {
  EditProductHelperService
} from '../edit-product-helper.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-edit-basic-details',
  templateUrl: './edit-basic-details.component.html',
  styleUrls: ['./edit-basic-details.component.scss']
})
export class EditBasicDetailsComponent implements OnInit, OnDestroy {
  public product: ProductModel = new ProductModel();
  public categories: Array<ProductCategory> = Object.values(ProductCategory).filter(value => typeof value === 'string');
  public basicDetailsFG!: FormGroup;
  public nameFC!: FormControl;
  public descriptionFC!: FormControl;
  public qtyInStockFC!: FormControl;
  public categoryFC!: FormControl;
  public priceFC!: FormControl;
  public isPopularFC!: FormControl;
  private _subscribeMain: boolean = true;

  constructor(private _productsBroker: ProductsBrokerService,
              private _editProductHelper: EditProductHelperService,
              private _fb: FormBuilder) {}

  ngOnInit(): void {
    this._createForm();
    this._initSubscriptions();
  }

  ngOnDestroy(): void {
    this._subscribeMain = false;
  }

  private _initSubscriptions(): void {
    this._editProductHelper.productForEdit$
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(product => {
        this.product = product;
        this.basicDetailsFG.reset(product);
      });
  }

  private _createForm(): void {
    this.basicDetailsFG = this._fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantityInStock: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required]],
      isPopular: [false],
    });
    this.nameFC = this.basicDetailsFG.controls['name'] as FormControl;
    this.descriptionFC = this.basicDetailsFG.controls['description'] as FormControl;
    this.qtyInStockFC = this.basicDetailsFG.controls['quantityInStock'] as FormControl;
    this.categoryFC = this.basicDetailsFG.controls['category'] as FormControl;
    this.priceFC = this.basicDetailsFG.controls['price'] as FormControl;
    this.isPopularFC = this.basicDetailsFG.controls['isPopular'] as FormControl;
  }

  public isInputValid(inputName: string): boolean {
    let formControl: FormControl;
    switch(inputName) {
      case 'name':
        formControl = this.nameFC;
        break;
      case 'description':
        formControl = this.descriptionFC;
        break;
      case 'quantityInStock':
        formControl = this.qtyInStockFC;
        break;
      case 'category':
        formControl = this.categoryFC;
        break;
      case 'price':
        formControl = this.priceFC;
        break;
      case 'isPopular':
        formControl = this.isPopularFC;
        break;
      default:
        formControl = new FormControl();
        break;
    }
    return formControl.touched || formControl.dirty;
  }

  public getInputValidationClasses(inputName: string): Record<string, boolean> {
    let formControl: FormControl;
    switch(inputName) {
      case 'name':
        formControl = this.nameFC;
        break;
      case 'description':
        formControl = this.descriptionFC;
        break;
      case 'quantityInStock':
        formControl = this.qtyInStockFC;
        break;
      case 'category':
        formControl = this.categoryFC;
        break;
      case 'price':
        formControl = this.priceFC;
        break;
      case 'isPopular':
        formControl = this.isPopularFC;
        break;
      default:
        formControl = new FormControl();
        break;
    }
    return {
      'is-invalid': (formControl.touched || formControl.dirty) && !!formControl.errors,
      'is-valid': (formControl.touched || formControl.dirty) && !formControl.errors
     };
  }

  public capitalizeCategoryName(categoryName: string): string {
    return categoryName
      .split('_')
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ')
      .trim();
  }

  public submit(): void {
    if (confirm('Are you sure you want to update the product details?')) {
      this._productsBroker.editProductBasicDetails(this.product._id, this.basicDetailsFG.value);
    }
  }

  public resetForm(): void {
    this.basicDetailsFG.reset(this.product);
  }
}