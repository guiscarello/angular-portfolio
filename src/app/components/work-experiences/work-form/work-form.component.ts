import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkExperience } from 'src/app/interfaces/WorkExperience';
import { formatDate } from '@angular/common';
import { WorkExperiencesService } from 'src/app/services/work-experiences.service';

@Component({
  selector: 'app-work-form',
  templateUrl: './work-form.component.html',
  styleUrls: ['./work-form.component.scss']
})
export class WorkFormComponent implements OnInit {

	//work has the selected work that will be edited, purpose is used for choosing the type of submission (create new record or update an existing one)
	@Input() work!: WorkExperience | null;
	@Input() purpose!: string;
	
	//Define the structure of the edit form
	workForm: FormGroup = new FormGroup({
		companyName: new FormControl('', Validators.required),
		companyLogo: new FormControl(''),
		startDate: new FormControl('',  Validators.required),
		endDate: new FormControl('',  Validators.required),
		position: new FormControl('',  Validators.required),
		description: new FormControl('',  Validators.required),
		tel: new FormControl(''),
	})

	constructor(
		//inject the work experince service to gain access to methods
		private workExperiencesService: WorkExperiencesService 
	) {
	}

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges){
		//Update the form values fields with the current work selected, it happen when some of the properties passed to this components change (e.g. when openinf the edit work dialog)
		this.workForm.patchValue({
			companyName: this.work?.companyName,
			companyLogo: null,
			startDate: (typeof this.work?.startDate !== 'undefined') ? formatDate(this.work?.startDate, "yyyy-MM-dd", "en-US") : null,
			endDate: (typeof this.work?.endDate !== 'undefined') ? formatDate(this.work?.endDate, "yyyy-MM-dd", "en-US") : null,
			position: this.work?.position,
			description: this.work?.description,
			tel: this.work?.tel			
		})
	}
	//On click submit button from edit work form (app-edit-work > app-work-form > button)
	onSubmit(){
		//Create new work from work form values and previous work id (only field not available for editing)
		let work: WorkExperience = <WorkExperience>this.workForm.value;
		//If form purpose is for edit the record, then...
		if(this.purpose === "Edit"){
			//add id to work
			work.id = this.work!.id;
			//Pass the updated work to the work experiences service...
			this.workExperiencesService.sendUpdatedWork(work);
		} else if(this.purpose === "New"){
			//Pass new work to the work experiences service...
			this.workExperiencesService.sendNewWork(work);
		}
	}

}
