import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  @Output() closeDialog: EventEmitter<Event> = new EventEmitter();

  constructor() { }

  emitEvent(){
    this.closeDialog.emit();
  }
}
