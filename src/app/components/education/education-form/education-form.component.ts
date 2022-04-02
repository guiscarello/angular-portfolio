import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdatedEducationDTO } from 'src/app/interfaces/dto/UpdateEducationDTO';
import { Education } from 'src/app/interfaces/Education';
import { EducationService } from 'src/app/services/education.service';
import { DialogService } from 'src/app/services/shared/dialog.service';

@Component({
	selector: 'app-education-form',
	templateUrl: './education-form.component.html',
	styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent implements OnInit {
	
	//work has the selected work that will be edited, purpose is used for choosing the type of submission (create new record or update an existing one)
	@Input() education!: Education | null;
	@Input() purpose!: string;
	descriptionMinLength: number = 30;
	educationForm: FormGroup;
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
		private fb: FormBuilder,
		private dialogService: DialogService
	) {
		//Define the structure of the edit form
		this.educationForm = this.fb.group({
			institutionName: ['', [Validators.required]],
			logo: [null, Validators.required],
			name: ['', [Validators.required]],
			type: ['', [Validators.required]],
			hasTitle: [true, ],
			titleName: [null, ],
			year: ['', [Validators.required]],
			duration: ['', [Validators.required]],
			description: ['', [Validators.required, Validators.minLength(this.descriptionMinLength)]]
		});
		this.educationForm.get('titleName')?.disable();
	}

	ngOnInit(): void {
		//Set title name disabled as default and habilitate it based on checkbox hasTitle
		this.educationForm.get('hasTitle')?.valueChanges.subscribe(
			(value: any) => {
				console.log("Has title: ", value)
				const title = this.educationForm.get('titleName');
				if(value){
					title?.enable()
					title?.setValidators([Validators.required]);
					title?.updateValueAndValidity();;
				}else{
					title?.setValue('');
					title?.disable();
					title?.clearValidators();
					title?.updateValueAndValidity();
				}
			}
		);
	}

	ngOnChanges(){
			
		if(this.purpose === 'New'){
			const logo = this.educationForm.get("logo");
			logo?.setValidators([Validators.required]);
			logo?.updateValueAndValidity();
			this.dialogService.closeDialog.subscribe(() => {
				this.educationForm.reset({
					type: ''
				});
			});
		}else if(this.purpose === 'Edit'){
			console.log('Education: ', this.education)
			const control = this.educationForm.get("logo");
			control?.clearValidators();
			control?.updateValueAndValidity();
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
			});
		}
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
		
		if(this.educationForm.valid){
			//Create new work from work form values and previous work id (only field not available for editing)
			const formData = new FormData();
			
			console.log("hastitle: " + this.educationForm.get("hasTitle")?.value);

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
				let updatedEducationDTO: UpdatedEducationDTO = {
					formData,
					education: this.education ?? undefined
				}
				//Pass the updated work to the work experiences service...
				this.educationService.sendUpdatedEducation(updatedEducationDTO);
			} else if(this.purpose === "New"){
				//Pass new work to the work experiences service...
				this.educationService.sendNewEducation(formData);
			}
		} else {
			Object.keys(this.educationForm.controls).forEach(
				field => {
					if(field === 'hasTitle' && this.educationForm.get(field)?.value === false){
						//do not set as touched the input titleName if the education has no title
						
					} else {
						console.log(field)
						const control = this.educationForm.get(field);
						control?.markAsTouched({onlySelf:true});
					}
				}
			);
		}
	}


	isFieldInValid(field: string){
		if (this.educationForm.get(field)?.untouched){
			return undefined;
		} else if(!this.educationForm.get(field)?.valid && this.educationForm.get(field)?.touched){
			return true;
		} else {
			return false
		}
	}

	displayFieldClass(field: string){
		if(this.isFieldInValid(field) == undefined){
			return "";
		} else if(this.isFieldInValid(field)){
			return "is-invalid";
		} else {
			return "is-valid";
		}
	}

	get logo(){
		return this.educationForm.controls['logo'];
	}

	get institutionName(){
		return this.educationForm.controls['institutionName'];
	}

	get name(){
		return this.educationForm.controls['name'];
	}

	get type(){
		return this.educationForm.controls['type'];
	}

	get titleName(){
		return this.educationForm.controls['titleName'];
	}

	get year(){
		return this.educationForm.controls['year'];
	}

	get duration(){
		return this.educationForm.controls['duration'];
	}

	get description(){
		return this.educationForm.controls['description'];
	}

}
