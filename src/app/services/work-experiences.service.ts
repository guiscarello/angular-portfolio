import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { WorkExperience } from '../interfaces/WorkExperience';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MessagesService } from './shared/messages.service';
import { messageType } from '../enums/messageType';
import { ErrorHandlerService } from './shared/error/error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkExperiencesService {

	httpOptions = {
		headers: new HttpHeaders({
			'Content-type':'application/json'
		}),
		
	}
	private apiUrl = environment.apiUrl + "work-experience";

	private updateWorkSubject = new Subject<WorkExperience>();
	private addWorkSubject = new Subject<any>();
	private deleteWorkSubject = new Subject<WorkExperience>();

	constructor(
		private http: HttpClient,
		private errorHandler: ErrorHandlerService
	) { }

	sendUpdatedWork(work: WorkExperience){
		this.updateWorkSubject.next(work);
	}

	getUpdatedWork(): Observable<WorkExperience>{
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

	updateWorkExperience(work: WorkExperience): Observable<WorkExperience>{
		return this.http
		.put<WorkExperience>(`${this.apiUrl}/edit/${work.id}`, work, this.httpOptions);
	}
	deleteWorkExperience(workToDelete: WorkExperience): Observable<number>{
		return this.http
			.delete<number>(`${this.apiUrl}/delete/${workToDelete.id}`, this.httpOptions);
	}

}
