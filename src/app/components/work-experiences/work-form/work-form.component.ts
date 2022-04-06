import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateWorkExperienceDTO } from 'src/app/interfaces/dto/UpdateWorkExperienceDTO';
import { WorkExperience } from 'src/app/interfaces/WorkExperience';
import { WorkExperiencesService } from 'src/app/services/work-experiences.service';
import { DialogService } from '../../../services/shared/dialog.service';


@Component({
  selector: 'app-work-form',
  templateUrl: './work-form.component.html',
  styleUrls: ['./work-form.component.scss']
})
export class WorkFormComponent implements OnInit {

	//work has the selected work that will be edited, purpose is used for choosing the type of submission (create new record or update an existing one)
	@Input() work!: WorkExperience | null;
	@Input() purpose!: string;
	descriptionMinLength: number =100;
	isCurrentWork: boolean = true;
	
	//Define the structure of the form
	workForm = this.fb.group({
		companyName: ['', [Validators.required]],
		companyLogo: ['', [Validators.required]],
		startDate: ['', [Validators.required]],
		endDate: ['', ],
		position: ['',[Validators.required]],
		description: ['', [Validators.required, Validators.minLength(this.descriptionMinLength)]],
		tel: ['',[Validators.required]],
		currentWork: [true]
	});

	constructor(
		//inject the work experince service to gain access to methods
		private workExperiencesService: WorkExperiencesService,
		private fb: FormBuilder,
		private dialogService: DialogService,

	) {
	}

	ngOnInit(): void {
		this.workForm.get("currentWork")?.valueChanges.subscribe(
			(currentWork) => {
				if(this.purpose === "New"){
					if(currentWork){
						this.workForm.get("endDate")?.clearValidators();
						//console.log("enddate", this.workForm.get("endDate")?.value)
					} else {
						this.workForm.get("endDate")?.setValidators([Validators.required]);
					}
					this.workForm.get("endDate")?.updateValueAndValidity();
				} else {
					if(currentWork){
						this.workForm.get("endDate")?.setValue(null)
						this.workForm.get("endDate")?.clearValidators();
						//console.log("enddate", this.workForm.get("endDate")?.value)
					} else {
						this.workForm.get("endDate")?.setValidators([Validators.required]);
					}
					this.workForm.get("endDate")?.updateValueAndValidity();
				}
			}
		)

	}

	ngOnChanges(){
		
		console.log("work", this.work)
		console.log("Purpose", this.purpose)
		//if work is not null (when passing data for edit) then set form values as work attributes for displaying once the form dialog opened
		if(this.purpose === "New"){

			const control = this.workForm.get("companyLogo");
			control?.setValidators([Validators.required]);
			control?.updateValueAndValidity();

			this.dialogService.closeDialog.subscribe(() => {
				this.workForm.reset("");
				this.workForm.get("currentWork")?.setValue(true);
			});
		} else if(this.purpose === "Edit"){
					
			const control = this.workForm.get("companyLogo");
			control?.clearValidators();
			control?.updateValueAndValidity();
			

			this.workForm.patchValue({
				companyName: this.work?.companyName,
				companyLogo: null,
				startDate: this.work?.startDate,
				endDate: this.work?.endDate,
				position: this.work?.position,
				description: this.work?.description,
				tel: this.work?.tel,
				currentWork: this.work?.currentWork			
			});
		}

	}

	onFileSelect(event: Event){
		let target = event.target as HTMLInputElement;
		if(target?.files?.[0] != null){
			const file = target.files[0];
			this.workForm.get("companyLogo")?.setValue(file);
			console.log("logo: ", this.workForm.get("companyLogo")?.value);
		};
	}
		
	onSubmit(event: Event){

		if(this.workForm.valid){
			const formData = new FormData();

			console.log("enddate", this.workForm.get("endDate")?.value)
			console.log("Is current work?: " , this.workForm.get("currentWork")?.value);
			
			formData.append("companyName", this.workForm.get("companyName")?.value);
			formData.append("companyLogo", this.workForm.get("companyLogo")?.value);
			formData.append("startDate", this.workForm.get("startDate")?.value);
			if(this.workForm.get("endDate")?.value === ""){
				formData.append("endDate", '');
			} else {
				formData.append("endDate", this.workForm.get("endDate")?.value);
			}
			
			formData.append("position", this.workForm.get("position")?.value);
			formData.append("description", this.workForm.get("description")?.value);
			formData.append("tel", this.workForm.get("tel")?.value);
			formData.append("currentWork", this.workForm.get("currentWork")?.value);
	
			//If form purpose is for edit the record, then...
			if(this.purpose === "Edit"){
				//add id to work
				//work.id = this.work!.id;
				let updateWorkExperienceDTO: UpdateWorkExperienceDTO = {
					formData,
					work: this.work ?? undefined
				};
				//Pass the updated work to the work experiences service...
				this.workExperiencesService.sendUpdatedWork(updateWorkExperienceDTO);
			} else if(this.purpose === "New"){
				//Pass new work to the work experiences service...
				this.workExperiencesService.sendNewWork(formData);
			}
		} else {
			Object.keys(this.workForm.controls).forEach(
				field => {
					const control = this.workForm.get(field);
					control?.markAsTouched({onlySelf:true});
				}
			);
		}
		
	}

	isFieldInValid(field: string){
		if (this.workForm.get(field)?.untouched){
			return undefined;
		} else if(!this.workForm.get(field)?.valid && this.workForm.get(field)?.touched){
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

	get companyName(){
		return this.workForm.controls["companyName"];
	}

	get startDate(){
		return this.workForm.controls["startDate"];
	}

	get endDate(){
		return this.workForm.controls["endDate"];
	}

	get position(){
		return this.workForm.controls["position"];
	}

	get description(){
		return this.workForm.controls["description"];
	}

	get tel(){
		return this.workForm.controls["tel"];
	}

	get currentWork(){
		return this.workForm.controls["currentWork"].value;
	}
}
