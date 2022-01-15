import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkExperience } from '../interfaces/WorkExperience';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkExperiencesService {

	httpOptions = {
		headers: new HttpHeaders({
		'Content-type':'application/json'
		})
	}
	private apiUrl = "http://localhost:5000/work";

	private updateWorkSubject = new Subject<WorkExperience>();
	private addWorkSubject = new Subject<WorkExperience>();
	private deleteWorkSubject = new Subject<WorkExperience>();

	constructor(
		private http: HttpClient
	) { }

	sendUpdatedWork(work: WorkExperience){
		this.updateWorkSubject.next(work);
	}

	getUpdatedWork(): Observable<WorkExperience>{
		return this.updateWorkSubject.asObservable();
	}

	sendNewWork(work: WorkExperience){
		this.addWorkSubject.next(work);
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
		return this.http.post<WorkExperience>(this.apiUrl, work, this.httpOptions);
	}	

	updateWorkExperience(work: WorkExperience): Observable<WorkExperience>{
		return this.http
		.put<WorkExperience>(`${this.apiUrl}/${work.id}`, work, this.httpOptions);
	}
	deleteWorkExperience(work: WorkExperience): Observable<WorkExperience>{
		return this.http
			.delete<WorkExperience>(`${this.apiUrl}/${work.id}`, this.httpOptions);
	}

}
