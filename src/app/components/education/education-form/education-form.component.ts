import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Education } from 'src/app/interfaces/Education';
import { EducationService } from 'src/app/services/education.service';

@Component({
	selector: 'app-education-form',
	templateUrl: './education-form.component.html',
	styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent implements OnInit {
	
	//work has the selected work that will be edited, purpose is used for choosing the type of submission (create new record or update an existing one)
	@Input() education!: Education | null;
	@Input() purpose!: string;
	
	//Define the structure of the edit form
	educationForm: FormGroup = new FormGroup({
		institutionName: new FormControl('',),
		logo: new FormControl(''),
		name: new FormControl('',  ),
		type: new FormControl('',  ),
		hasTitle: new FormControl('',  ),
		titleName: new FormControl(''),
		year: new FormControl('',  ),
		duration: new FormControl('',  ),
		description: new FormControl(false)
	})

	constructor(
		//inject the educaiton service to gain access to methods
		private educatioService: EducationService,
	) {
	}

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges){
		//Update the form values fields with the current work selected, it happen when some of the properties passed to this components change (e.g. when openinf the edit work dialog)
		this.educationForm.patchValue({
			institutionName: this.education?.institutionName,
			logo: null,
			name: this.education?.name,
			type: this.education?.type,
			hasTitle: this.education?.hasTitle,
			titleName: this.education?.titleName,
			year: this.education?.year,
			duration: this.education?.duration,
			description: this.education?.description,	
		})
	}

	onFileSelect(event: Event){
		
		let target = event.target as HTMLInputElement;
			if(target?.files?.[0] != null){

				const file = target.files[0];
				this.educationForm.get("logo")?.setValue(file);
				console.log(this.educationForm.get("logo")?.value);
		};
	}
		
	//On click submit button from edit work form (app-edit-work > app-work-form > button)
	onSubmit(){
		//Create new work from work form values and previous work id (only field not available for editing)
		const formData = new FormData();

		formData.append("institutionName", this.educationForm.get("institutionName")?.value);
		formData.append("logo", this.educationForm.get("logo")?.value);
		formData.append("name", this.educationForm.get("name")?.value);
		formData.append("type", this.educationForm.get("type")?.value);
		formData.append("hasTitle", this.educationForm.get("hasTitle")?.value);
		formData.append("titleName", this.educationForm.get("titleName")?.value);
		formData.append("year", this.educationForm.get("year")?.value);
		formData.append("duration", this.educationForm.get("duration")?.value);
		formData.append("description", this.educationForm.get("description")?.value);

		//If form purpose is for edit the record, then...
		if(this.purpose === "Edit"){
			//add id to work
			//work.id = this.work!.id;
			//Pass the updated work to the work experiences service...
			//this.workExperiencesService.sendUpdatedWork(formData);
		} else if(this.purpose === "New"){
			//Pass new work to the work experiences service...
			this.educatioService.sendNewEducation(formData);
		}
	}

}
