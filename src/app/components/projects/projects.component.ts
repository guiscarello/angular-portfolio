import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { Subject, Subscription } from 'rxjs';
import { messageType } from 'src/app/enums/messageType';
import { UpdateProjectDTO } from 'src/app/interfaces/dto/UpdateProjectDTO';
import { Project } from 'src/app/interfaces/Project';
import { ProjectsService } from 'src/app/services/projects.service';
import { DialogService } from 'src/app/services/shared/dialog.service';
import { ErrorHandlerService } from 'src/app/services/shared/error/error-handler.service';
import { MessagesService } from 'src/app/services/shared/messages.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  	private addProjectDialogVisible: boolean = false;
	private editProjectDialogVisible: boolean = false;
	private imageDisplayDialogVisible: boolean = false;
	projects: any[] = [];
	@Output() addProjectDialogId: string = "addProjectDialog";
	@Output() editProjectDialogId: string = "editProjectDialog";

	getProjectSubscription!: Subscription;
	deleteProjectSubsciption!: Subscription;
	addNewProjectSubscription!: Subscription;
	updateProjectSubsciption!: Subscription;

	addProjectDialog: Modal | undefined;
	editProjectDialog: Modal | undefined;
	imageDisplayDialog: Modal | undefined;

	currentProject!: Project;

	constructor(
		private projectsService: ProjectsService,
		private dialogService: DialogService,
		private errorHandlerService: ErrorHandlerService,
		private messageService: MessagesService
	) {}

	ngOnInit(): void {
		
		this.getProjectSubscription = this.projectsService.getProjects().subscribe({	
			next: projects => {
				//console.log(projects);
				this.projects = projects;
			}
		});
	
		this.addNewProjectSubscription = this.projectsService.getNewProject().subscribe({
			next: newProjectData => this.addProject(newProjectData)
		});

		this.projectsService.getProjectToUpdate().subscribe({
			next: projectToUpdateDTO => this.updateEducation(projectToUpdateDTO)
		});

		this.deleteProjectSubsciption = this.projectsService.getProjectToDelete().subscribe({
			next: projectToDelete => this.deleteProject(projectToDelete)
		});
		
		this.updateProjectSubsciption = this.dialogService.closeDialog.subscribe(() => {
			this.addProjectDialog?.hide();
			this.editProjectDialog?.hide();
		});
		
		this.dialogService.closeDialog.subscribe(() => {
			this.imageDisplayDialog?.hide();
		})
	}

	ngOnDestroy(){
		this.getProjectSubscription.unsubscribe();
		this.deleteProjectSubsciption.unsubscribe();
		this.addNewProjectSubscription.unsubscribe();
		this.updateProjectSubsciption.unsubscribe();
	}

	addProject(newProjectData: FormData){
		
		this.projectsService.addNewProject(newProjectData).subscribe({
			next: (newProject) => {
				this.projects.push(newProject);	
				this.addProjectDialog?.hide();
				this.dialogService.emitEvent();
				console.log(newProject)
			},
			error: err => {
				console.log(err);
				this.errorHandlerService.httpErrorHandler(err);
				this.addProjectDialog?.hide();
				this.dialogService.emitEvent();
			},
			complete: () => {
				//console.log("Proyecto agregado con exito");
				this.messageService.sendAlertMessage(
					{
						message: "Proyecto agregado con exito",
						type: messageType.success
					}
				)
			}
		})
	}

	updateEducation(projectToUpdateDTO: UpdateProjectDTO) {
		this.projectsService.updateProject(projectToUpdateDTO).subscribe({
			next: (updatedProject) => {
				let updatedProjectIndex: number = this.projects.findIndex(e => e.id == updatedProject.id);
				this.projects[updatedProjectIndex] = updatedProject;
				this.editProjectDialog?.hide();
			},
			error: err => {
				console.log(err);
				this.errorHandlerService.httpErrorHandler(err);
				this.editProjectDialog?.hide();
				this.dialogService.emitEvent();
			},
			complete: () => {
				//console.log("Proyecto editado con exito");
				this.messageService.sendAlertMessage(
					{
						message: "Proyecto editado con exito",
						type: messageType.success
					}
				)
			}
		})
	}

	deleteProject(projectToDelete: Project){
		this.projectsService.deleteProject(projectToDelete).subscribe({
			next: (id) => {
				let deletedProjectId = this.projects.findIndex(p => p.id === id);
				this.projects.splice(deletedProjectId, 1)	
			},
			error: err => {
				console.log(err);
				this.errorHandlerService.httpErrorHandler(err);
			},
			complete: () => {
				//console.log("Proyecto borrado con exito");
				this.messageService.sendAlertMessage(
					{
						message: "Proyecto con id " + projectToDelete.id + " borrado con exito",
						type: messageType.success
					}
				)
			}
		})
		
	}
	
	showAddProjectDialog(): void{
		this.addProjectDialogVisible = !this.addProjectDialogVisible;
		if(this.addProjectDialogVisible){
			this.addProjectDialog = new bootstrap.Modal(document.getElementById(this.addProjectDialogId)!, {
			backdrop: 'static',
			keyboard: false
			});
			this.addProjectDialog.show();
		}
		this.addProjectDialogVisible = !this.addProjectDialogVisible;
	}

	showEditDialog($event: any){
		this.editProjectDialogVisible = !this.editProjectDialogVisible;
		this.currentProject = $event.project;
		if(this.editProjectDialogVisible){
			this.editProjectDialog = new bootstrap.Modal(document.getElementById(this.editProjectDialogId)!, {
				backdrop: 'static',
				keyboard: false
			});
			this.editProjectDialog.show();
		}
		this.editProjectDialogVisible = !this.editProjectDialogVisible;
	}

	showImageDisplay($event:any){
		this.imageDisplayDialogVisible = !this.imageDisplayDialogVisible;
		this.currentProject = $event.project;
		if(this.imageDisplayDialogVisible){
			this.imageDisplayDialog = new bootstrap.Modal(document.getElementById("image-display")!, {
				backdrop: 'static',
				keyboard: false
			});
			this.imageDisplayDialog.show();
		}
		this.imageDisplayDialogVisible = !this.imageDisplayDialogVisible;
	}

}
