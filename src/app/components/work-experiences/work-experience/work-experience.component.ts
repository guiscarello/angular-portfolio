import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkExperience } from '../../../interfaces/WorkExperience';
import { WorkExperiencesService } from 'src/app/services/work-experiences.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss']
})
export class WorkExperienceComponent implements OnInit {

  @Input() work!: WorkExperience;
  @Output() openEditDialogEmitter = new EventEmitter();
  
	workImageUrl: Observable<string | null>;

  constructor(
    private workExperiencesService: WorkExperiencesService,
    private storage: AngularFireStorage
  ) { 
    const ref = this.storage.ref(this.work.companyLogoPath);
		this.workImageUrl = ref.getDownloadURL();
  }

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
