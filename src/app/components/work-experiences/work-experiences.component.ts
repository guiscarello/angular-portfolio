import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { DialogService } from '../../services/shared/dialog.service';
import { WorkExperience } from '../../interfaces/WorkExperience';
import { WorkExperiencesService } from '../../services/work-experiences.service';
import { Subscription } from 'rxjs';
import { MessagesService } from 'src/app/services/shared/messages.service';
import { UpdateWorkExperienceDTO } from 'src/app/interfaces/dto/UpdateWorkExperienceDTO';
import { messageType } from 'src/app/enums/messageType';
import { ErrorHandlerService } from 'src/app/services/shared/error/error-handler.service';


@Component({
  selector: 'app-work-experiences',
  templateUrl: './work-experiences.component.html',
  styleUrls: ['./work-experiences.component.scss']
})
export class WorkExperiencesComponent implements OnInit {

	private addWorkDialogVisible: boolean = false;
	private editWorkDialogVisible: boolean = false;
	workExperiences: WorkExperience[] = [];
	@Output() addWorkDialogId: string = "addWorkDialog";
	@Output() editWorkDialogId: string = "editWorkDialog";

	getWorksSubscription!: Subscription;
	deleteWorkSubsciption!: Subscription;
	addNewWorkSubscription!: Subscription;
	updateWorkSubsciption!: Subscription;

	addWorkDialog: Modal | undefined;
	editWorkDialog: Modal | undefined;

	currentWork!: WorkExperience;

	constructor(
		private workExperiencesService: WorkExperiencesService,
		private dialogService: DialogService,
		private messageService: MessagesService,
		private errorHandlerService: ErrorHandlerService
	) {}

	ngOnInit(): void {
		
		this.getWorksSubscription = this.workExperiencesService.getWorkExperiences().subscribe({	
			next: works => {
				//console.log(works);
				this.workExperiences = works;
			},	
			error: err => {
				console.log(err);
				this.errorHandlerService.httpErrorHandler(err);
			}
		});
	
		this.addNewWorkSubscription = this.workExperiencesService.getNewWork().subscribe({
			next: newWork => this.addWork(newWork)
		});

		this.workExperiencesService.getUpdatedWork().subscribe({
			next: udaptedWork => this.updateWork(udaptedWork),
		});

		this.deleteWorkSubsciption = this.workExperiencesService.getWorkToDelete().subscribe({
			next: workToDelete => this.deleteWork(workToDelete)
		});
		
		this.updateWorkSubsciption = this.dialogService.closeDialog.subscribe(() => {
			this.addWorkDialog?.hide();
			this.editWorkDialog?.hide();
		});
	}

	ngOnDestroy(){
		this.getWorksSubscription.unsubscribe();
		this.deleteWorkSubsciption.unsubscribe();
		this.addNewWorkSubscription.unsubscribe();
		this.updateWorkSubsciption.unsubscribe();
	}

	addWork(newWork: WorkExperience){
		this.workExperiencesService.addNewWorkExperience(newWork).subscribe({
			next: (newWork) => {
				this.workExperiences.push(newWork);	
				this.addWorkDialog?.hide();
				this.dialogService.emitEvent();
			},
			error: err => {
				console.log(err);
				this.errorHandlerService.httpErrorHandler(err);
				this.addWorkDialog?.hide();
				this.dialogService.emitEvent();
			},
			complete: () => {
				//console.log("Experiencia de trabajo agregada con exito");
				this.messageService.sendAlertMessage(
					{
						message: "La experiencia de trabajo fue agregada con exito",
						type: messageType.success
					}
				)
			}
		})
	}

	updateWork(updateWorkExperienceDTO: UpdateWorkExperienceDTO) {
		this.workExperiencesService.updateWorkExperience(updateWorkExperienceDTO).subscribe({
			next: (updatedWork) => {
				let updatedWorkIndex: number = this.workExperiences.findIndex(work => work.id == updatedWork.id);
				this.workExperiences[updatedWorkIndex] = updatedWork;
				this.editWorkDialog?.hide();
			},
			error: err => {
				console.log(err);
				this.errorHandlerService.httpErrorHandler(err);
				this.editWorkDialog?.hide();
				this.dialogService.emitEvent();
			},
			complete: () => {
				//console.log("Experiencia de trabajo editada con exito");
				this.messageService.sendAlertMessage(
					{
						message: "La experiencia de trabajo fue editada con exito",
						type: messageType.success
					}
				)
			}
		})
	}

	deleteWork(workToDelete: WorkExperience){
		this.workExperiencesService.deleteWorkExperience(workToDelete).subscribe({
			next: () => {
				let deletedWorkId = this.workExperiences.findIndex(work => work.id === workToDelete.id);
				this.workExperiences.splice(deletedWorkId, 1);	
			},
			error: err => {
				console.log(err);
				this.errorHandlerService.httpErrorHandler(err);
			},
			complete: () => {
				//console.log("Experiencia de trabajo eliminada con exito");
				this.messageService.sendAlertMessage(
					{
						message: "La experiencia de trabajo con id " + workToDelete.id + " fue eliminada con exito",
						type: messageType.success
					}
				)
			}
		})
		
	}
	
	showAddWorkDialog(): void{
		this.addWorkDialogVisible = !this.addWorkDialogVisible;
		if(this.addWorkDialogVisible){
			this.addWorkDialog = new bootstrap.Modal(document.getElementById(this.addWorkDialogId)!, {
			backdrop: 'static',
			keyboard: false
			});
			this.addWorkDialog.show();
		}
		this.addWorkDialogVisible = !this.addWorkDialogVisible;
	}

	showEditDialog($event: any){
		this.editWorkDialogVisible = !this.editWorkDialogVisible;
		this.currentWork = $event.work;
		console.log("currentwork" , this.currentWork)
		if(this.editWorkDialogVisible){
			this.editWorkDialog = new bootstrap.Modal(document.getElementById(this.editWorkDialogId)!, {
				backdrop: 'static',
				keyboard: false
			});
			this.editWorkDialog.show();
		}
		this.editWorkDialogVisible = !this.editWorkDialogVisible;
	}

}
