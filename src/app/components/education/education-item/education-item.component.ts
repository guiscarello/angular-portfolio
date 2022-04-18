import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
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
	educationImageUrl!: Observable<string | null>;
  
  constructor(
    private educationService: EducationService,
    private storage: AngularFireStorage
  ) { 
  }

  ngOnInit(): void {
    const ref = this.storage.ref(this.education?.institutionLogoPath);
		this.educationImageUrl = ref.getDownloadURL();
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
