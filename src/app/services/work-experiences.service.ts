import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { WorkExperience } from '../interfaces/WorkExperience';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MessagesService } from './shared/messages.service';
import { messageType } from '../enums/messageType';
import { ErrorHandlerService } from './shared/error/error-handler.service';
import { environment } from 'src/environments/environment';
import { UpdateWorkExperienceDTO } from '../interfaces/dto/UpdateWorkExperienceDTO';

@Injectable({
  providedIn: 'root'
})
export class WorkExperiencesService {

	httpOptions = {
		headers: new HttpHeaders({
			'Content-type':'application/json'
		}),
		
	}
	private apiUrl = environment.apiUrl + "work-experiences";

	private updateWorkSubject = new Subject<UpdateWorkExperienceDTO>();
	private addWorkSubject = new Subject<any>();
	private deleteWorkSubject = new Subject<WorkExperience>();

	constructor(
		private http: HttpClient,
		private errorHandler: ErrorHandlerService
	) { }

	sendUpdatedWork(updateWorkExperienceDTO: UpdateWorkExperienceDTO){
		this.updateWorkSubject.next(updateWorkExperienceDTO);
	}

	getUpdatedWork(): Observable<UpdateWorkExperienceDTO>{
		return this.updateWorkSubject.asObservable();
	}

	sendNewWork(formData: FormData){
		this.addWorkSubject.next(formData);
	}
	getNewWork(): Observable<WorkExperience>{
		return this.addWorkSubject.asObservable();
	}	

	sendWorkToDelete(workToDelete: WorkExperience){
		this.deleteWorkSubject.next(workToDelete);
	}
	getWorkToDelete(): Observable<WorkExperience>{
		return this.deleteWorkSubject.asObservable();
	}

	//Methods for comunicating with the server using HTTP Client service from HttpClientModule
	//Get all work experience records from server
	getWorkExperiences(): Observable<WorkExperience[]>{
		return this.http.get<WorkExperience[]>(this.apiUrl);
	}
	
	addNewWorkExperience(work: WorkExperience): Observable<WorkExperience>{
		return this.http.post<WorkExperience>(this.apiUrl, work);
	}	

	updateWorkExperience(updateWorkExperienceDTO: UpdateWorkExperienceDTO): Observable<any>{
		return this.http
		.put<WorkExperience>(`${this.apiUrl}/${updateWorkExperienceDTO.work?.id}`, updateWorkExperienceDTO.formData);
	}
	deleteWorkExperience(workToDelete: WorkExperience): Observable<any>{
		return this.http
			.delete<any>(`${this.apiUrl}/${workToDelete.id}`, this.httpOptions);
	}

}
