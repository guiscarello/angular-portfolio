import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Education } from '../interfaces/Education';
import { ErrorHandlerService } from './shared/error/error-handler.service';
import { environment } from 'src/environments/environment';
import { UpdatedEducationDTO } from '../interfaces/dto/UpdateEducationDTO';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  
	httpOptions = {
		headers: new HttpHeaders({
			'Content-type':'application/json'
		}),
		
	}
	private apiUrl = environment.apiUrl + "educations";

	private updateEducationSubject = new Subject<UpdatedEducationDTO>();
	private addEducationSubject = new Subject<any>();
	private deleteEducationSubject = new Subject<Education>();

	constructor(
		private http: HttpClient,
		private errorHandler: ErrorHandlerService
	) { }

	sendUpdatedEducation(updatedEducationDTO: UpdatedEducationDTO){
		this.updateEducationSubject.next(updatedEducationDTO);
	}

	getUpdatedEducation(): Observable<UpdatedEducationDTO>{
		return this.updateEducationSubject.asObservable();
	}

	sendNewEducation(formData: FormData){
		this.addEducationSubject.next(formData);
	}
	getNewEducation(): Observable<Education>{
		return this.addEducationSubject.asObservable();
	}	

	sendEducationToDelete(eToDelete: Education){
		this.deleteEducationSubject.next(eToDelete);
	}
	getEducationToDelete(): Observable<Education>{
		return this.deleteEducationSubject.asObservable();
	}

	//Methods for comunicating with the server using HTTP Client service from HttpClientModule
	//Get all education records from server
	getEducation(): Observable<Education[]>{
		return this.http.get<Education[]>(this.apiUrl);
	}
	
	addNewEducation(education: Education): Observable<Education>{
		return this.http.post<Education>(this.apiUrl, education);
	}	

	updateEducation(updatedEducationDTO: UpdatedEducationDTO): Observable<Education>{
		return this.http
		.put<Education>(`${this.apiUrl}/${updatedEducationDTO.education?.id}`, updatedEducationDTO.formData);
	}

	deleteEducation(e: Education): Observable<number>{
		return this.http
			.delete<number>(`${this.apiUrl}/${e.id}`, this.httpOptions);
	}

}


