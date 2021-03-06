import { Component, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { Observable, Subscription } from 'rxjs';
import { messageType } from 'src/app/enums/messageType';
import { UpdateSkillDTO } from 'src/app/interfaces/dto/UpdateSkillDTO';
import { ProjectsService } from 'src/app/services/projects.service';
import { DialogService } from 'src/app/services/shared/dialog.service';
import { ErrorHandlerService } from 'src/app/services/shared/error/error-handler.service';
import { MessagesService } from 'src/app/services/shared/messages.service';
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
		private errorHandlerService: ErrorHandlerService,
		private messageService: MessagesService
	) {

	}

	ngOnInit(): void {
		
		this.getSkillsSubscription = this.skillService.getSkills().subscribe({	
			next: skills => {
				this.skills = skills;
				this.projectsService.sendSkillsToProjectForm(this.skills);
			}
		});
	
		this.addNewSkillSubscription = this.skillService.getNewSkill().subscribe({
			next: newSkillData => {
				this.addSkill(newSkillData);
			}
		});

		this.skillService.getSkillToUpdate().subscribe({
			next: skillToUpdate => this.updateSkill(skillToUpdate)
		});

		this.deleteSkillSubsciption = this.skillService.getSkillToDelete().subscribe({
			next: skillToDelete => this.deleteSkill(skillToDelete)
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
				this.projectsService.sendSkillsToProjectForm(this.skills);
			},
			error: err => {
				console.log(err);
				this.errorHandlerService.httpErrorHandler(err);
				this.addSkillDialog?.hide();
				this.dialogService.emitEvent();
			},
			complete: () => {
				//console.log("Habilidad agregada con exito");
				this.messageService.sendAlertMessage(
					{
						message: "Habilidad agregada con exito",
						type: messageType.success
					}
				)
			}
		})
	}

	updateSkill(updateSkillDTO: UpdateSkillDTO) {
		this.skillService.updateSkill(updateSkillDTO).subscribe({
			next: (updatedSkill) => {
				let updatedSkillIndex: number = this.skills.findIndex(skill => skill.id == updatedSkill.id);
				this.skills[updatedSkillIndex] = updatedSkill;
				this.editSkillDialog?.hide();
				this.projectsService.sendSkillsToProjectForm(this.skills);
			},
			error: err => {
				console.log(err);
				this.errorHandlerService.httpErrorHandler(err);
				this.editSkillDialog?.hide();
				this.dialogService.emitEvent();
			},
			complete: () => {
				//console.log("Habilidad editada con exito");
				this.messageService.sendAlertMessage(
					{
						message: "Habilidad editada con exito",
						type: messageType.success
					}
				)
			}
		})
	}

	deleteSkill(skillToDelete: Skill){
		this.skillService.deleteSkill(skillToDelete).subscribe({
			next: (id) => {
				let deletedSkillId = this.skills.findIndex(skill => skill.id === id);
				this.skills.splice(deletedSkillId, 1);
				this.projectsService.sendSkillsToProjectForm(this.skills);
			},
			error: err => {
				console.log("Delete skill", err);
				this.errorHandlerService.httpErrorHandler(err, "Primero debe eliminar los proyectos asociados a la habilidad");
			},
			complete: () => {
				//console.log("Habilidad borrada con exito");
				this.messageService.sendAlertMessage(
					{
						message: "Habilidad con id " + skillToDelete.id + " borrada con exito",
						type: messageType.success
					}
				)
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
