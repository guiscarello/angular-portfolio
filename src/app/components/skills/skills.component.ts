import { Component, OnInit, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { Subscription } from 'rxjs';
import { UpdateSkillDTO } from 'src/app/interfaces/dto/UpdateSkillDTO';
import { ProjectsService } from 'src/app/services/projects.service';
import { DialogService } from 'src/app/services/shared/dialog.service';
import { Skill } from '../../interfaces/Skill';
import { SkillsService } from '../../services/skills.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

	private addSkillDialogVisible: boolean = false;
	private editSkillDialogVisible: boolean = false;
	skills: Skill[] = [];
	@Output() addSkillDialogId: string = "addSkillDialog";
	@Output() editSkillDialogId: string = "editSkillDialog";

	getSkillsSubscription!: Subscription;
	deleteSkillSubsciption!: Subscription;
	addNewSkillSubscription!: Subscription;
	updateSkillSubsciption!: Subscription;

	addSkillDialog: Modal | undefined;
	editSkillDialog: Modal | undefined;

	currentSkill!: Skill;

	constructor(
		private skillService: SkillsService,
		private projectsService: ProjectsService,
		private dialogService: DialogService,
	) {}

	ngOnInit(): void {
		
		this.getSkillsSubscription = this.skillService.getSkills().subscribe({	
			next: skills => {
				this.projectsService.sendSkillsToProjectForm(skills);
				this.skills = skills;
			}
		});
	
		this.addNewSkillSubscription = this.skillService.getNewSkill().subscribe({
			next: newSkillData => this.addSkill(newSkillData)
		});

		this.skillService.getSkillToUpdate().subscribe({
			next: skillToUpdate => this.updateSkill(skillToUpdate),
			complete: () => console.log("work updated")
		});

		this.deleteSkillSubsciption = this.skillService.getSkillToDelete().subscribe({
			next: skillToDelete => this.deleteSkill(skillToDelete),
			complete: () => {
				console.log("Experiencia de trabajo eliminada con exito");
			}
		});
		
		this.updateSkillSubsciption = this.dialogService.closeDialog.subscribe(() => {
			this.addSkillDialog?.hide();
			this.editSkillDialog?.hide();
		});
	}

	ngOnDestroy(){
		this.getSkillsSubscription.unsubscribe();
		this.deleteSkillSubsciption.unsubscribe();
		this.addNewSkillSubscription.unsubscribe();
		this.updateSkillSubsciption.unsubscribe();
	}

	addSkill(formData: FormData){
		this.skillService.addNewSkill(formData).subscribe({
			next: (newSkill) => {
				this.skills.push(newSkill);	
				this.addSkillDialog?.hide();
				this.dialogService.emitEvent();
			},
			error: err => console.log(err)
		})
	}

	updateSkill(updateSkillDTO: UpdateSkillDTO) {
		this.skillService.updateSkill(updateSkillDTO).subscribe({
			next: (updatedSkill) => {
				let updatedSkillIndex: number = this.skills.findIndex(skill => skill.id == updatedSkill.id);
				this.skills[updatedSkillIndex] = updatedSkill;
				this.editSkillDialog?.hide();
			},
			error: err => console.log(err),
			complete: () => {
				this.projectsService.sendSkillsToProjectForm(this.skills);
				//alert(`Registro con id: "${updatedWork.id}" editado con exito.`);
			}
		})
	}

	deleteSkill(skillToDelete: Skill){
		this.skillService.deleteSkill(skillToDelete).subscribe({
			next: (id) => {
				let deletedSkillId = this.skills.findIndex(skill => skill.id === id);
				this.skills.splice(deletedSkillId, 1)	
			},
			error: err => console.log(err),
			complete: () => {
				alert("Habilidad eliminada con exito");
			}
		})
		
	}
	
	showAddSkillDialog(): void{
		this.addSkillDialogVisible = !this.addSkillDialogVisible;
		if(this.addSkillDialogVisible){
			this.addSkillDialog = new bootstrap.Modal(document.getElementById(this.addSkillDialogId)!, {
			backdrop: 'static',
			keyboard: false
			});
			this.addSkillDialog.show();
		}
		this.addSkillDialogVisible = !this.addSkillDialogVisible;
	}

	showEditDialog($event: any){
		this.editSkillDialogVisible = !this.editSkillDialogVisible;
		this.currentSkill = $event.skill;
		if(this.editSkillDialogVisible){
			this.editSkillDialog = new bootstrap.Modal(document.getElementById(this.editSkillDialogId)!, {
				backdrop: 'static',
				keyboard: false
			});
			this.editSkillDialog.show();
		}
		this.editSkillDialogVisible = !this.editSkillDialogVisible;
	}

}
