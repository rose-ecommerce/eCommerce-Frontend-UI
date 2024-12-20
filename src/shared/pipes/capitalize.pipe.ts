import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string, separator: string): string {
    if ((typeof value === 'string') &&
        (value.length > 0) &&
        (typeof separator === 'string') &&
        (separator.length > 0)) {
      return value
        .split(separator)
        .map(word => {
          if (word === 'AND') {
            return '&'
          }
          return word;
        })
        .map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ')
        .trim();
    }
    return value;
  }

}
