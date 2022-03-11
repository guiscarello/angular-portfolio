import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
		institutionName: new FormControl('', ),
		logo: new FormControl(''),
		name: new FormControl('', ),
		type: new FormControl('', ),
		hasTitle: new FormControl(false, ),
		titleName: new FormControl('', ),
		year: new FormControl('', ),
		duration: new FormControl('', ),
		description: new FormControl('', )
	})

	//Add types of educations, could be replaced for a table in db
	selectOptions: string[] = [
		"Curso online",
		"Curso presencial",
		"Carrera online",
		"Carrera presencial"
	];

	constructor(
		//inject the educaiton service to gain access to methods
		private educationService: EducationService,
	) {
		this.educationForm.get('titleName')?.disable();
	}

	ngOnInit(): void {
		//Set title name disabled as default and habilitate it based on checkbox hasTitle
		this.educationForm.get('hasTitle')?.valueChanges.subscribe(
			value => {
				if(value){
					this.educationForm.get('titleName')?.enable()
				}else{
					this.educationForm.get('titleName')?.disable()
				}
			}
		);
	}

	ngOnChanges(changes: SimpleChanges){
		//Update the form values fields with the current work selected, it happen when some of the properties passed to this components change (e.g. when openinf the edit work dialog)
		this.educationForm.patchValue({
			institutionName: this.education?.institutionName,
			institutionLogoPath: null,
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
		let checkboxValue = this.educationForm.get("hasTitle")?.value;
		
		console.log("hastitle: " + this.educationForm.get("hasTitle")?.value);

		formData.append("institutionName", this.educationForm.get("institutionName")?.value);
		formData.append("institutionLogoPath", this.educationForm.get("institutionLogoPath")?.value);
		formData.append("name", this.educationForm.get("name")?.value);
		formData.append("type", this.educationForm.get("type")?.value);
		formData.append("hasTitle", checkboxValue);
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
			this.educationService.sendNewEducation(formData);
		}
	}

}
