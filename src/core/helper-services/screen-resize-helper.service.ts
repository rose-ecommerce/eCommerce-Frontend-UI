import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  map,
  Observable,
  startWith
} from 'rxjs';

@Injectable()
export class ScreenResizeHelperService {
  private _screenWidth$: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);
  public screenWidth$: Observable<number> =  this._screenWidth$.asObservable();

  constructor() {
    fromEvent(window, 'resize')
      .pipe(
        map(() => window.innerWidth),
        startWith(window.innerWidth)
      )
      .subscribe(width => this._screenWidth$.next(width));
  }

  // TODO Works only if present inside component
  // @HostListener('window:resize', ['$event'])
  // public onResize(event: Event) {
  //   this._screenWidth$.next(window.innerWidth);
  // }
}
