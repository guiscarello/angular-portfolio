import { Component, OnInit, Output } from '@angular/core';
import { EducationService } from '../../services/education.service';
import { Education } from '../../interfaces/Education';
import { Subscription } from 'rxjs';
import { Modal } from 'bootstrap';
import { DialogService } from 'src/app/services/shared/dialog.service';
import * as bootstrap from 'bootstrap';
import { UpdateWorkExperienceDTO } from 'src/app/interfaces/dto/UpdateWorkExperienceDTO';
import { UpdatedEducationDTO } from 'src/app/interfaces/dto/UpdateEducationDTO';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  	private addEducationDialogVisible: boolean = false;
	private editEducationDialogVisible: boolean = false;
	educations: Education[] = [];
	@Output() addEducationDialogId: string = "addEducaitonDialog";
	@Output() editEducationDialogId: string = "editEducationDialog";

	getEducationSubscription!: Subscription;
	deleteEducationSubsciption!: Subscription;
	addNewEducationSubscription!: Subscription;
	updateEducationSubsciption!: Subscription;

	addEducationDialog: Modal | undefined;
	editEducationDialog: Modal | undefined;

	currentEducation!: Education;

	constructor(
		private educationService: EducationService,
		private dialogService: DialogService,
	) {}

	ngOnInit(): void {
		
		this.getEducationSubscription = this.educationService.getEducation().subscribe({	
			next: educations => this.educations = educations
		});
	
		this.addNewEducationSubscription = this.educationService.getNewEducation().subscribe({
			next: newEducation => this.addEducation(newEducation)
		});

		this.educationService.getUpdatedEducation().subscribe({
			next: updatedEducationDTO => this.updateEducation(updatedEducationDTO),
			complete: () => console.log("Education updated")
		});

		this.deleteEducationSubsciption = this.educationService.getEducationToDelete().subscribe({
			next: educationToDelete => this.deleteWork(educationToDelete),
			complete: () => {
				console.log("education deleted with success");
			}
		});
		
		this.updateEducationSubsciption = this.dialogService.closeDialog.subscribe(() => {
			this.addEducationDialog?.hide();
			this.editEducationDialog?.hide();
		});
	}

	ngOnDestroy(){
		this.getEducationSubscription.unsubscribe();
		this.deleteEducationSubsciption.unsubscribe();
		this.addNewEducationSubscription.unsubscribe();
		this.updateEducationSubsciption.unsubscribe();
	}

	addEducation(newEducation: Education){
		this.educationService.addNewEducation(newEducation).subscribe({
			next: (newEducation) => {
				this.educations.push(newEducation);	
				this.addEducationDialog?.hide();
				this.dialogService.emitEvent();
			},
			error: err => console.log(err)
		})
	}

	updateEducation(updatedEducationDTO: UpdatedEducationDTO) {
		this.educationService.updateEducation(updatedEducationDTO).subscribe({
			next: (updatedEducation) => {
				let updatedEducationIndex: number = this.educations.findIndex(e => e.id == updatedEducation.id);
				this.educations[updatedEducationIndex] = updatedEducation;
				this.editEducationDialog?.hide();
			},
			error: err => console.log(err),
			complete: () => {
				
			}
		})
	}

	deleteWork(educationToDelete: Education){
		this.educationService.deleteEducation(educationToDelete).subscribe({
			next: (id) => {
				let deletedEducationId = this.educations.findIndex(e => e.id === id);
				this.educations.splice(deletedEducationId, 1)	
			},
			error: err => console.log(err),
			complete: () => {
				alert("educacion eliminada con exito");
			}
		})
		
	}
	
	showAddEducationDialog(): void{
		this.addEducationDialogVisible = !this.addEducationDialogVisible;
		if(this.addEducationDialogVisible){
			this.addEducationDialog = new bootstrap.Modal(document.getElementById(this.addEducationDialogId)!, {
			backdrop: 'static',
			keyboard: false
			});
			this.addEducationDialog.show();
		}
		this.addEducationDialogVisible = !this.addEducationDialogVisible;
	}

	showEditDialog($event: any){
		this.editEducationDialogVisible = !this.editEducationDialogVisible;
		this.currentEducation = $event.education;
		if(this.editEducationDialogVisible){
			this.editEducationDialog = new bootstrap.Modal(document.getElementById(this.editEducationDialogId)!, {
				backdrop: 'static',
				keyboard: false
			});
			this.editEducationDialog.show();
		}
		this.editEducationDialogVisible = !this.editEducationDialogVisible;
	}

}
