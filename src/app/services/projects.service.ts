import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateProjectDTO } from '../interfaces/dto/UpdateProjectDTO';
import { Project } from '../interfaces/Project';
import { Skill } from '../interfaces/Skill';
import { ErrorHandlerService } from './shared/error/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

	httpOptions = {
		headers: new HttpHeaders({
			'Content-type':'application/json'
		}),
		
	}
	private apiUrl = environment.apiUrl + "projects";

 	private sendNewProjectSubject = new Subject<FormData>();
	private sendProjectToUpdateSubject = new Subject<UpdateProjectDTO>();
	private sendProjectToDeleteSubject = new Subject<Project>();
	private sendSkillsToProjectFormSubject = new Subject<Skill[]>();

	constructor(
		private http: HttpClient,
		private errorHandler: ErrorHandlerService
	) { }

	sendSkillsToProjectForm(skills: Skill[]){
		return this.sendSkillsToProjectFormSubject.next(skills);
	}

	getSkillsForProjectForm(): Observable<Skill[]>{
		return this.sendSkillsToProjectFormSubject.asObservable();
	}

	sendNewProject(formData: FormData){
		this.sendNewProjectSubject.next(formData);
	}
	getNewProject(): Observable<FormData>{
		return this.sendNewProjectSubject.asObservable();
	}	

	sendProjectToUpdate(updateProjectDTO: UpdateProjectDTO){
		this.sendProjectToUpdateSubject.next(updateProjectDTO);
	}

	getProjectToUpdate(): Observable<UpdateProjectDTO>{
		return this.sendProjectToUpdateSubject.asObservable();
	}

	sendProjectToDelete(projectToDelete: Project){
		this.sendProjectToDeleteSubject.next(projectToDelete);
	}
	getProjectToDelete(): Observable<Project>{
		return this.sendProjectToDeleteSubject.asObservable();
	}

	//Methods for comunicating with the server using HTTP Client service from HttpClientModule
	getProjects(): Observable<any>{
		return this.http.get(this.apiUrl).pipe(
			tap(result => {    
				//console.log(result)          
                return result;
            })
		);
	}
	
	addNewProject(formData: FormData): Observable<Project>{
		return this.http.post<Project>(this.apiUrl, formData);
	}	

	updateProject(updateProjectDTO: UpdateProjectDTO): Observable<any>{
		return this.http
		.put<Project>(`${this.apiUrl}/${updateProjectDTO.project?.id}`, updateProjectDTO.formData);
	}

	deleteProject(projectToDelete: Project): Observable<number>{
		return this.http
			.delete<number>(`${this.apiUrl}/${projectToDelete.id}`, this.httpOptions);
	}
}
