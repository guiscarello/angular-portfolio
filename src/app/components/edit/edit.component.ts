import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @Output() editEventEmitter = new EventEmitter<any>();
  @Output() deleteEventEmitter = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onEditWork(){
    this.editEventEmitter.emit();
  }

  onDeleteWork(){
    this.deleteEventEmitter.emit();
  }

}
