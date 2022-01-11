import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @Output() editWorkCbEmitter = new EventEmitter();
  @Output() deleteWorkCbEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onEditWorkCb (){
    this.editWorkCbEmitter.emit();
  };

  onDeleteWorkCb (){
    this.deleteWorkCbEmitter.emit();
  }

}
