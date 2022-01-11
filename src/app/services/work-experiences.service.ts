import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WorkExperience } from '../interfaces/WorkExperience';
import { Observable, throwError } from 'rxjs';
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
	private apiUrl = "http://localhost:5000/work"

	@Output() updatedWorkEmitter: EventEmitter<WorkExperience> = new EventEmitter();

	constructor(
		private http: HttpClient
	) { }

	//This is used for passing the updated work when the work-form component (of the edit-work component) submits the form.
	emitUpdatedWork(work: WorkExperience){
		this.updatedWorkEmitter.emit(work);
	}
	//This is used to get a reference to the updated work that was emited with previous method, and for later subscriptions.
	getUpdatedWork(): EventEmitter<WorkExperience>{
		return this.updatedWorkEmitter;
	}

	getWorkExperiences(): Observable<WorkExperience[]>{
		return this.http.get<WorkExperience[]>(this.apiUrl);
	}

	updateWorkExperience(work: WorkExperience): Observable<WorkExperience>{
		return this.http
		.put<WorkExperience>(`${this.apiUrl}/${work.id}`, work, this.httpOptions);
	}

}
