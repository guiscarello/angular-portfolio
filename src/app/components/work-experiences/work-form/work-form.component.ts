import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkExperience } from 'src/app/interfaces/WorkExperience';
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
		companyName: new FormControl('',),
		companyLogo: new FormControl(''),
		startDate: new FormControl('',  ),
		endDate: new FormControl('',  ),
		position: new FormControl('',  ),
		description: new FormControl('',  ),
		tel: new FormControl(''),
		isCurrentWork: new FormControl(false)
	})

	constructor(
		//inject the work experince service to gain access to methods
		private workExperiencesService: WorkExperiencesService,
	) {
	}

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges){
		//Update the form values fields with the current work selected, it happen when some of the properties passed to this components change (e.g. when openinf the edit work dialog)
		this.workForm.patchValue({
			companyName: this.work?.companyName,
			companyLogo: null,
			startDate: this.work?.startDate,
			endDate: this.work?.endDate,
			position: this.work?.position,
			description: this.work?.description,
			tel: this.work?.tel,
			isCurrentWork: this.work?.isCurrentWork			
		})
	}

	onFileSelect(event: Event){
		
		let target = event.target as HTMLInputElement;
			if(target?.files?.[0] != null){

				const file = target.files[0];
				this.workForm.get("companyLogo")?.setValue(file);
				console.log(this.workForm.get("companyLogo")?.value);
		};
	}
		
	//On click submit button from edit work form (app-edit-work > app-work-form > button)
	onSubmit(){
		//Create new work from work form values and previous work id (only field not available for editing)
		const formData = new FormData();
		
		let checkboxValue = this.workForm.get("isCurrentWork")?.value;
		console.log(checkboxValue);
		formData.append("companyName", this.workForm.get("companyName")?.value);
		formData.append("companyLogo", this.workForm.get("companyLogo")?.value);
		formData.append("startDate", this.workForm.get("startDate")?.value);
		formData.append("endDate", this.workForm.get("endDate")?.value);
		formData.append("position", this.workForm.get("position")?.value);
		formData.append("description", this.workForm.get("description")?.value);
		formData.append("tel", this.workForm.get("tel")?.value);
		formData.append("isCurrentWork", checkboxValue);

		//If form purpose is for edit the record, then...
		if(this.purpose === "Edit"){
			//add id to work
			//work.id = this.work!.id;
			//Pass the updated work to the work experiences service...
			//this.workExperiencesService.sendUpdatedWork(formData);
		} else if(this.purpose === "New"){
			//Pass new work to the work experiences service...
			this.workExperiencesService.sendNewWork(formData);
		}
	}

}
