import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  transform(value: string): string {
    return value
      .replace(/\n/g, '<br>')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

}
