import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

	apiUrl: string = environment.apiUrl + "contacts"

	constructor(
		private http: HttpClient
	) { }
	
	sendContactData(formData: FormData): Observable<any>{
		return this.http.post(this.apiUrl, formData, {responseType: 'text'});
	}
		

}
