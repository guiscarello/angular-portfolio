import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Skill } from '../interfaces/Skill';
import { UpdateSkillDTO } from '../interfaces/dto/UpdateSkillDTO';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './shared/error/error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class SkillsService {

	httpOptions = {
		headers: new HttpHeaders({
			'Content-type':'application/json'
		}),
		
	}
	private apiUrl = environment.apiUrl + "skills";

 	private sendNewSkillSubject = new Subject<FormData>();
	private sendSkillToUpdateSubject = new Subject<UpdateSkillDTO>();
	private sendSkillToDeleteSubject = new Subject<Skill>();

	constructor(
		private http: HttpClient,
	) { }

	sendNewSkill(formData: FormData){
		this.sendNewSkillSubject.next(formData);
	}
	getNewSkill(): Observable<FormData>{
		return this.sendNewSkillSubject.asObservable();
	}	

	sendSkillToUpdate(updateSkillDTO: UpdateSkillDTO){
		this.sendSkillToUpdateSubject.next(updateSkillDTO);
	}

	getSkillToUpdate(): Observable<UpdateSkillDTO>{
		return this.sendSkillToUpdateSubject.asObservable();
	}

	sendSkillToDelete(skillToDelete: Skill){
		this.sendSkillToDeleteSubject.next(skillToDelete);
	}
	getSkillToDelete(): Observable<Skill>{
		return this.sendSkillToDeleteSubject.asObservable();
	}

	//Methods for comunicating with the server using HTTP Client service from HttpClientModule
	//Get all skill records from server
	getSkills(): Observable<Skill[]>{
		return this.http.get<Skill[]>(this.apiUrl);
	}
	
	addNewSkill(formData: FormData): Observable<Skill>{
		return this.http.post<Skill>(this.apiUrl, formData);
	}	

	updateSkill(updateSkillDTO: UpdateSkillDTO): Observable<any>{
		return this.http
		.put<Skill>(`${this.apiUrl}/${updateSkillDTO.skill?.id}`, updateSkillDTO.formData);
	}

	deleteSkill(skillToDelete: Skill): Observable<number>{
		return this.http
			.delete<number>(`${this.apiUrl}/${skillToDelete.id}`, this.httpOptions);
	}

}
