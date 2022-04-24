import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UpdateProjectDTO } from 'src/app/interfaces/dto/UpdateProjectDTO';
import { Project } from 'src/app/interfaces/Project';
import { Skill } from 'src/app/interfaces/Skill';
import { ProjectsService } from 'src/app/services/projects.service';
import { DialogService } from 'src/app/services/shared/dialog.service';
import { SkillsService } from 'src/app/services/skills.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {

	@Input() project!: Project | null;
	@Input() purpose!: string;
	@Input() addNewProjectEmitter: any;
	descriptionMinLength: number = 30;
	projectForm!: FormGroup;
	skills: Skill[] = [];
	skillsToSave: Skill[] = [];
	skillsIds: number[] = [];
	additionalImages: File[] = [];

	getSkillsSubscription: Subscription = new Subscription();

	constructor(
		private projectsService: ProjectsService,
		private fb: FormBuilder,
		private dialogService: DialogService
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
			next: skills => {
				for(let skill of skills){
					this.skills.push(skill);
				}
			}
		});
	}

	ngOnChanges(){
		if(this.purpose === 'New'){
			this.dialogService.closeDialog.subscribe(() => {
				this.projectForm.reset({
					type: ''
				});
			});
		}else if(this.purpose === 'Edit'){
			let skills = this.project?.skills;
			if(skills){	
				for (const skill of skills) {
					this.skillsToSave.push(skill);
				}
			}
			//console.log("Edit 1",this.skills )
			//console.log("Edit 1",this.skillsToSave )
			for(let skillToDelete of this.skillsToSave){
				this.skills = this.skills.filter(skill => skill.id !== skillToDelete.id);
			}
			//console.log("Edit 2",this.skills )
			this.projectForm.patchValue({
				photos: [''],
				title: this.project?.title,
				startDate: this.project?.startDate,
				endDate: this.project?.endDate,
				description: this.project?.description,
			});
		}
	}

	ngOnDestroy(){
		this.getSkillsSubscription.unsubscribe();
	}
	
	onFileSelect(event: Event){
		let target = event.target as HTMLInputElement;
		if(target?.files?.[0] != null){
			const file = target.files[0];
			this.projectForm.get("mainImage")?.setValue(file);
			console.log(this.projectForm.get("mainImage")?.value);
		};
	}

	onFilesSelect(event: Event){
		let target = event.target as HTMLInputElement;
		if(target?.files?.length != null){
			const files = target.files;
			for(let i=0; i < files.length; i++){
				this.additionalImages.push(files[i]);
			}
			console.log("Additional images",this.additionalImages);
		};
	}
		
	//On click submit button from edit work form (app-edit-work > app-work-form > button)
	onSubmit(){
		

		console.log(this.skillsToSave.length > 0)
		console.log(this.projectForm.valid)

		if(this.projectForm.valid && this.skillsToSave.length > 0){
			console.log("entro")
			//Create new work from work form values and previous work id (only field not available for editing)
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

			//If form purpose is for edit the record, then...
			if(this.purpose === "Edit"){
				let updateProjectDTO: UpdateProjectDTO = {
					formData,
					project: this.project ?? undefined
				}
				//Pass the updated project to the projects service...
				this.projectsService.sendProjectToUpdate(updateProjectDTO);
			} else if(this.purpose === "New"){
				//Pass new project to the projects service...
				this.projectsService.sendNewProject(formData);
			}
		} else {
			console.log("no entro")
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
		for (const skill of this.skills) {
			this.skillsToSave.push(skill);
		}
		this.skills = _.difference(this.skills,this.skillsToSave);
	}

	addSelectedSkills(){
		let skillsSelected: string[] = this.projectForm.get('allSkills')?.value;
		//console.log("seleceted: ", skillsSelected);
		if(skillsSelected.length > 0){
			//console.log(skillsSelected);
			//console.log(skillsSelected.map(Number));
			for(let i=0; i < skillsSelected.length; i++ ){
				let skill = this.skills.find(skill => skill.id === Number(skillsSelected[i]));
				//console.log("skill", skill)
				if(skill !== undefined){
					this.skillsToSave.push(skill);
				}
				//console.log(this.skillsToSave);
			}
			this.skills = _.difference(this.skills,this.skillsToSave);
		}
	}

	removeSelectedSkills(){
		let skillsSelected: string[] = this.projectForm.get('skillsToSave')?.value;
		//console.log("seleceted: ", skillsSelected);
		if(skillsSelected.length > 0){
			//console.log(skillsSelected);
			//console.log(skillsSelected.map(Number));
			for(let i=0; i < skillsSelected.length; i++ ){
				let skill = this.skillsToSave.find(skill => skill.id === Number(skillsSelected[i]));
				//console.log("skill", skill)
				if(skill !== undefined){
					this.skills.push(skill);
				}
				//console.log(this.skillsToSave);
			}
			this.skillsToSave = _.difference(this.skillsToSave,this.skills);
		}
	}

	removeAllSkills(){
		for (const skill of this.skillsToSave) {
			this.skills.push(skill);
		}
		this.skillsToSave = _.difference(this.skillsToSave,this.skills);
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
