import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateSkillDTO } from 'src/app/interfaces/dto/UpdateSkillDTO';
import { Skill } from 'src/app/interfaces/Skill';
import { DialogService } from 'src/app/services/shared/dialog.service';
import { SkillsService } from 'src/app/services/skills.service';

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss']
})
export class SkillFormComponent implements OnInit {

	//skill has the selected skill that will be edited, purpose is used for choosing the type of submission (create new record or update an existing one)
	@Input() skill!: Skill | null;
	@Input() purpose!: string;
	levelPercentage!: number;
	skillForm: FormGroup;
	selectOptions: string[] = [
		"Principiante",
		"Principiante-Intermedio",
		"Intermedio",
		"Intermedio-avanzado",
		"Avanzado",
		"Experto"
	];

	constructor(
		private skillsService: SkillsService,
		private fb: FormBuilder,
		private dialogService: DialogService,
	) {
		//Define the structure of the form
		this.skillForm = this.fb.group({
			name: ['', [Validators.required]],
			level: ['', [Validators.required]],
			logo: [null, [Validators.required]],
			color: ['', Validators.required]
	});
	}

	ngOnInit(): void {
		
		this.skillForm.get("level")?.valueChanges.subscribe(
			(level) => {
				//console.log(level);
				switch (level) {
					case "Principiante":
						this.levelPercentage = 25;
						break;
					case "Principiante-Intermedio":
						this.levelPercentage = 37.5;
						break;
					case "Intermedio":
						this.levelPercentage = 50;
						break;
					case "Intermedio-avanzado":
						this.levelPercentage = 67.5;
						break;
					case "Avanzado":
						this.levelPercentage = 80;
						break;
					case "Experto":
						this.levelPercentage = 100;
						break;
					default:
						break;
				}
				console.log(this.levelPercentage);
			}
		);

	}

	ngOnChanges(){
		//console.log("Skill: ", this.skill)
		//console.log("Purpose", this.purpose)
		if(this.purpose === "New"){
			const logo = this.skillForm.get('logo');
			logo?.setValidators([Validators.required]);
			logo?.updateValueAndValidity();
			this.dialogService.closeDialog.subscribe(() => {
				this.skillForm.reset({
					level:''
				});
			});
		} else if(this.purpose === "Edit"){
			const logo = this.skillForm.get('logo');
			logo?.clearValidators();
			logo?.updateValueAndValidity();

			this.skillForm.patchValue({
				logo: null,
				name: this.skill?.name,
				level: this.skill?.level,
				color: this.skill?.color,
			});
		}
	}

	onFileSelect(event: Event){
		
		let target = event.target as HTMLInputElement;
			if(target?.files?.[0] != null){

				const file = target.files[0];
				this.skillForm.get("logo")?.setValue(file);
				//console.log("logo: ", this.skillForm.get("logo")?.value);
		};
	}
		
	//On click submit button from edit work form (app-edit-work > app-work-form > button)
	onSubmit(event: Event){
		if(this.skillForm.valid){
			const formData = new FormData();
		
			formData.append("name", this.skillForm.get("name")?.value);
			formData.append("logo", this.skillForm.get("logo")?.value);
			formData.append("level", this.skillForm.get("level")?.value);
			formData.append("color", this.skillForm.get("color")?.value);
			formData.append("levelPercentage", this.levelPercentage.toString());
	
	
			//If form purpose is for edit the record, then...
			if(this.purpose === "Edit"){
				//add id to work
				//work.id = this.work!.id;
				let updateSkillDTO: UpdateSkillDTO = {
					formData,
					skill: this.skill ?? undefined
				};
				//Pass the updated work to the work experiences service...
				this.skillsService.sendSkillToUpdate(updateSkillDTO);
			} else if(this.purpose === "New"){
				//Pass new work to the work experiences service...
				this.skillsService.sendNewSkill(formData);
			}
		} else{
			Object.keys(this.skillForm.controls).forEach(
				field => {
					const control = this.skillForm.get(field);
					control?.markAsTouched({onlySelf:true});
				}
			);
		}
		
	}


	isFieldInValid(field: string){
		if (this.skillForm.get(field)?.untouched){
			return undefined;
		} else if(!this.skillForm.get(field)?.valid && this.skillForm.get(field)?.touched){
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

	get name(){
		return this.skillForm.controls['name'];
	}

	get level(){
		return this.skillForm.controls['level'];
	}

	get logo(){
		return this.skillForm.controls['logo'];
	}


}
