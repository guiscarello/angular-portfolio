import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { DialogService } from '../../services/shared/dialog.service';
import { WorkExperience } from '../../interfaces/WorkExperience';
import { WorkExperiencesService } from '../../services/work-experiences.service';
import { Subscription } from 'rxjs';
import { MessagesService } from 'src/app/services/shared/messages.service';


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
		private messageService: MessagesService
	) {}

	ngOnInit(): void {
		
		this.getWorksSubscription = this.workExperiencesService.getWorkExperiences().subscribe({	
			next: works => this.workExperiences = works,
			complete: () => this.messageService.sendAlertMessage({
				message: "Nueva experienca de trabajo añadida!",
				type: "alert-success"
			})
		});
	
		this.addNewWorkSubscription = this.workExperiencesService.getNewWork().subscribe({
			next: newWork => this.addWork(newWork)
		});

		this.workExperiencesService.getUpdatedWork().subscribe({
			next: udaptedWork => this.updateWork(udaptedWork),
			complete: () => console.log("work updated")
		});

		this.deleteWorkSubsciption = this.workExperiencesService.getWorkToDelete().subscribe({
			next: workToDelete => this.deleteWork(workToDelete),
			complete: () => {
				console.log("Experiencia de trabajo eliminada con exito");
			}
		});
		
		this.updateWorkSubsciption = this.dialogService.closeDialog.subscribe(() => {
			this.addWorkDialog?.hide();
			this.editWorkDialog?.hide();
		});
	}

	ngOnDestroy(){
		this.deleteWorkSubsciption.unsubscribe();
		this.addNewWorkSubscription.unsubscribe();
		this.updateWorkSubsciption.unsubscribe();
	}

	addWork(newWork: WorkExperience){
		this.workExperiencesService.addNewWorkExperience(newWork).subscribe({
			next: (newWork) => {
				this.workExperiences.push(newWork);	
			},
			error: err => console.log(err)
		})
	}

	updateWork(updatedWork: WorkExperience) {
		this.workExperiencesService.updateWorkExperience(updatedWork).subscribe({
			next: (updatedWork) => {
				let updatedWorkIndex: number = this.workExperiences.findIndex(work => work.id == updatedWork.id);
				this.workExperiences[updatedWorkIndex] = updatedWork;
				this.editWorkDialog?.hide();
			},
			error: err => console.log(err),
			complete: () => {
				alert(`Registro con id: "${updatedWork.id}" editado con exito.`);
			}
		})
	}

	deleteWork(workToDelete: WorkExperience){
		this.workExperiencesService.deleteWorkExperience(workToDelete).subscribe({
			next: (deletedWork) => {
				let deletedWorkId = this.workExperiences.findIndex(work => work.id === deletedWork.id);
				this.workExperiences.splice(deletedWorkId, 1)	
			},
			error: err => console.log(err),
			complete: () => {
				alert("Experiencia de trabajo eliminada con exito");
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
