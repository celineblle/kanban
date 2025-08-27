import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleLimiter'
})
export class TitleLimiterPipe implements PipeTransform {

  transform(value: string, length: number = 40): string {
    if(value.length <= length) return value;

    const trucated = value.slice(0, length);
    return `${trucated} ...`;
  }

}
