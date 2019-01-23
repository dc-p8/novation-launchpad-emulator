import { Directive, OnChanges, Input, ElementRef, SimpleChanges} from '@angular/core';



@Directive({
  selector: '[CustomColor]'
})
export class CustomColorDirective implements OnChanges {
  @Input('CustomColor') color: string;

  updateVariable(color: string){
    if (color) {
      this.element.nativeElement.style.setProperty('--color', color);
    }
    else {
      this.element.nativeElement.style.removeProperty('--color');
    }
  }

  constructor(private element: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.color) {
      this.updateVariable(this.color);
    }
  }
}
