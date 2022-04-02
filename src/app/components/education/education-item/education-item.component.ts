import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EducationService } from 'src/app/services/education.service';
import { Education } from '../../../interfaces/Education';

@Component({
  selector: 'app-education-item',
  templateUrl: './education-item.component.html',
  styleUrls: ['./education-item.component.scss']
})
export class EducationItemComponent implements OnInit {

  @Input() education!: Education;
  @Output() openEditDialogEmitter = new EventEmitter();

  constructor(
    private educationService: EducationService
  ) { }

  ngOnInit(): void {
  }

  //Comunication using services with observables
  deleteEducation(){
    //On delete event (delete button pressed) send id of work selected to delete.
    this.educationService.sendEducationToDelete(this.education);
  }

  //Comunication using child and parent method
  editEducation(){
      //Send education to update to parent (education component)
      this.openEditDialogEmitter.emit({education: this.education});
  }

}
