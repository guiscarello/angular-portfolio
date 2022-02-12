import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkExperience } from '../../../interfaces/WorkExperience';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { WorkExperiencesService } from 'src/app/services/work-experiences.service';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss']
})
export class WorkExperienceComponent implements OnInit {

  @Input() work!: WorkExperience;
  @Output() openEditDialogEmitter = new EventEmitter();

  constructor(
    private workExperiencesService: WorkExperiencesService
  ) { }

  ngOnInit(): void {
  }

  //Comunication using services with observables
  deleteWork(){
    //On delete event (delete button pressed) send id of work selected to delete.
    this.workExperiencesService.sendWorkToDelete(this.work);
  }

  //Comunication using child and parent method
  editWork(){
      //Send work to update to parent (work experiences component)
      this.openEditDialogEmitter.emit({work: this.work});
  }


}
