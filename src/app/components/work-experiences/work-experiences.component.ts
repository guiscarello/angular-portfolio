import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { DialogService } from '../../services/shared/dialog.service';
import { WorkExperience } from '../../interfaces/WorkExperience';
import { WorkExperiencesService } from '../../services/work-experiences.service';


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

	addWorkDialog: Modal | undefined;
	editWorkDialog: Modal | undefined;

	currentWork!: WorkExperience;

	constructor(
		private workExperiencesService: WorkExperiencesService,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.workExperiencesService.getWorkExperiences().subscribe(
			works => {
			this.workExperiences = works; 
			}
		);
		this.dialogService.closeDialog.subscribe(() => {
			this.addWorkDialog?.hide();
			this.editWorkDialog?.hide();
		});
		this.workExperiencesService.getUpdatedWork().subscribe(
			work => {
				this.updateWork(work);
			}
		);
	}

	updateWork(work: WorkExperience) {
		this.workExperiencesService.updateWorkExperience(work).subscribe({
			next: (updatedWork) => {
				let updatedWorkIndex = this.workExperiences.findIndex(work => work.id == updatedWork.id);
				this.workExperiences[updatedWorkIndex] = updatedWork;
				this.editWorkDialog?.hide();
				
			},
			error: err => console.log(err),
			complete: () => {
				alert(`Registro con id: "${work.id}" editado con exito.`);
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
