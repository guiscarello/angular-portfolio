import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  closeDialog: EventEmitter<Event> = new EventEmitter();

  constructor() { }

  emitEvent(){
    this.closeDialog.emit();
  }
}
