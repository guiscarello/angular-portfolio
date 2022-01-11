import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkExperience } from '../../../interfaces/WorkExperience';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss']
})
export class WorkExperienceComponent implements OnInit {

  @Input() work!: WorkExperience;
  @Output() openEditDialogEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  deleteWork(){
    console.log("Work deleted")
  }

  editWork(){
      this.openEditDialogEmitter.emit({work: this.work});
  }


}
