import { PipeTransform, Pipe } from '@angular/core';

// created as a universal ngFor pipe so get the element when it's made 
// can be used for animation or callbacks
@Pipe({
	name: 'marginPipe'
})

export class MarginPipe implements PipeTransform {

  transform(value: number, el: any): any {
  	console.log(el.offsetHeight);
    return el.offsetHeight;
  }

}