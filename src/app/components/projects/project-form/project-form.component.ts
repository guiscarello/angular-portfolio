import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UpdateProjectDTO } from 'src/app/interfaces/dto/UpdateProjectDTO';
import { Project } from 'src/app/interfaces/Project';
import { Skill } from 'src/app/interfaces/Skill';
import { ProjectsService } from 'src/app/services/projects.service';
import { DialogService } from 'src/app/services/shared/dialog.service';
import { LoadingService } from 'src/app/services/shared/loading.service';
import { SkillsService } from 'src/app/services/skills.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {

	@Input() project!: Project;
	@Input() purpose!: string;
	@Input() addNewProjectEmitter: any;
	descriptionMinLength: number = 30;
	projectForm!: FormGroup;

	skills: Skill[] = [];
	allSkills: Skill[] = [];
	skillsToSave: Skill[] = [];

	skillsIds: number[] = [];
	additionalImages: File[] = [];

	getSkillsSubscription: Subscription = new Subscription();

	isLoading!: boolean;

	constructor(
		private projectsService: ProjectsService,
		private fb: FormBuilder,
		private dialogService: DialogService,
		private loadingService: LoadingService
	) {
		this.projectForm = this.fb.group({
			photos: [''],
			title: ['', [Validators.required]],
			startDate: [null, Validators.required],
			endDate: [null, Validators.required],
			mainImage: ['', Validators.required],
			additionalImages: ['', Validators.required],
			description: ['', [Validators.required, Validators.minLength(this.descriptionMinLength)]],
			allSkills:[''],
			skillsToSave:['']
		});
	}

	ngOnInit(): void{
		this.projectsService.getSkillsForProjectForm().subscribe({
			next: (skills:Skill[]) => {		
				this.skills = Array.from(skills);
				this.allSkills = Array.from(this.skills);
				this.skillsToSave = this.project?.skills ?? [];
				//console.log("skills to save", this.skillsToSave)
				if(this.skillsToSave.length > 0){
					this.allSkills = Array.from(this.skills);
					for(let _skill of this.skillsToSave){
						let index: number = this.allSkills.findIndex(skill => skill.id === _skill.id)
						if(index >= 0){
							this.allSkills.splice(index,1);
						}
					}
				}
			}
		});
		this.loadingService.getLoadingStatus().subscribe({
			next: status => {
				this.isLoading = status;
			}
		});		

	}

	ngOnChanges(changes: SimpleChanges){

		//console.log("project change: ", changes['project'].currentValue);
		//console.log("project skills", this.project?.skills);

		this.skillsToSave = this.project?.skills ?? [];
		//console.log("skills to save", this.skillsToSave)
		if(this.skillsToSave.length > 0){
			this.allSkills = Array.from(this.skills);
			for(let _skill of this.skillsToSave){
				let index: number = this.allSkills.findIndex(skill => skill.id === _skill.id)
				if(index >= 0){
					this.allSkills.splice(index,1);
				}
			}
		}
		this.projectForm.get("mainImage")?.clearValidators();
		this.projectForm.get("additionalImages")?.clearValidators();
		this.projectForm.updateValueAndValidity();

		this.projectForm.patchValue({
			photos: [''],
			title: this.project?.title,
			startDate: this.project?.startDate,
			endDate: this.project?.endDate,
			description: this.project?.description,
		});
		
	}

	ngOnDestroy(){
		this.getSkillsSubscription.unsubscribe();
	}
	
	onFileSelect(event: Event){
		let target = event.target as HTMLInputElement;
		if(target?.files?.[0] != null){
			const file = target.files[0];
			this.projectForm.get("mainImage")?.setValue(file);
			//console.log(this.projectForm.get("mainImage")?.value);
		};
	}

	onFilesSelect(event: Event){
		let target = event.target as HTMLInputElement;
		if(target?.files?.length != null){
			const files = target.files;
			for(let i=0; i < files.length; i++){
				this.additionalImages.push(files[i]);
			}
			//console.log("Additional images",this.additionalImages);
		};
	}
		
	onSubmit(){
		console.log(this.skillsToSave.length > 0)
		console.log(this.projectForm.valid)

		if(this.projectForm.valid && this.skillsToSave.length > 0){
			console.log("entro")
			const formData = new FormData();

			formData.append("title", this.projectForm.get("title")?.value);
			formData.append("startDate", this.projectForm.get("startDate")?.value);
			formData.append("endDate", this.projectForm.get("endDate")?.value);
			formData.append("mainImage", this.projectForm.get("mainImage")?.value);
			for(let i=0; i < this.additionalImages.length; i++){
				formData.append("additionalImages[]", this.additionalImages[i]);
			}
			formData.append("skillsIds[]", JSON.stringify(this.getSkillsIds(this.skillsToSave)));
			formData.append("description", this.projectForm.get("description")?.value);

			if(this.purpose === "Edit"){
				let updateProjectDTO: UpdateProjectDTO = {
					formData,
					project: this.project ?? undefined
				}
				this.projectsService.sendProjectToUpdate(updateProjectDTO);
				this.loadingService.setLoadingStatus(true);
			} else if(this.purpose === "New"){
				this.projectsService.sendNewProject(formData);
				this.loadingService.setLoadingStatus(true);
			}
		} else {
			console.log("skillsToSave",this.skillsToSave.length > 0)
			Object.keys(this.projectForm.controls).forEach(
				field => {
					const control = this.projectForm.get(field);
					control?.markAsTouched({onlySelf:true});
				}
			);
		}
	}

	getSkillsIds(skills: Skill[]): number[] {
		let ids = [];
		for (let i=0; i < skills.length; i++) {
			ids.push(skills[i].id);
		}
		return ids;
	}
	

	addAllSkills(){
		for (const skill of this.allSkills) {
			this.skillsToSave.push(skill);
		}
		this.allSkills = _.difference(this.allSkills,this.skillsToSave);
	}

	addSelectedSkills(){
		let skillsSelected: string[] = this.projectForm.get('allSkills')?.value;
		//console.log("seleceted: ", skillsSelected);
		if(skillsSelected != null && skillsSelected.length > 0){
			//console.log(skillsSelected);
			//console.log(skillsSelected.map(Number));
			for(let i=0; i < skillsSelected.length; i++ ){
				let skill = this.allSkills.find(skill => skill.id === Number(skillsSelected[i]));
				//console.log("skill", skill)
				if(skill !== undefined){
					this.skillsToSave.push(skill);
				}
				//console.log(this.skillsToSave);
			}
			this.allSkills = _.difference(this.allSkills,this.skillsToSave);
		}
	}

	removeSelectedSkills(){
		let skillsSelected: string[] = this.projectForm.get('skillsToSave')?.value;
		//console.log("seleceted: ", skillsSelected);
		if(skillsSelected != null && skillsSelected.length > 0){
			//console.log(skillsSelected);
			//console.log(skillsSelected.map(Number));
			for(let i=0; i < skillsSelected.length; i++ ){
				let skill = this.skillsToSave.find(skill => skill.id === Number(skillsSelected[i]));
				//console.log("skill", skill)
				if(skill !== undefined){
					this.allSkills.push(skill);
				}
				//console.log(this.skillsToSave);
			}
			this.skillsToSave = _.difference(this.skillsToSave,this.allSkills);
		}
	}

	removeAllSkills(){
		for (const skill of this.skillsToSave) {
			this.allSkills.push(skill);
		}
		this.skillsToSave = _.difference(this.skillsToSave,this.allSkills);
	}

	isFieldInValid(field: string){
		if (this.projectForm.get(field)?.untouched){
			return undefined;
		} else if(!this.projectForm.get(field)?.valid && this.projectForm.get(field)?.touched){
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
			return "valid";
		}
	}

	get hasSkillsToSave(){
		return this.skillsToSave?.length > 0;
	}

	get Controls(){
		return this.projectForm.controls;
	}

}
