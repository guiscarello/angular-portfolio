import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[configContent]'
})
export class ConfigDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
