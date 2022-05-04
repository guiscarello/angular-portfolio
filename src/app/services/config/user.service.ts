import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	apiUrl: string = environment.apiUrl + "users"

	constructor(private http: HttpClient) { }

	public getAllUsers(): Observable<User[]>{
		return this.http.get<User[]>(this.apiUrl);
	}

	public createNewUser(userData: FormData): Observable<User>{
		return this.http.post<User>(this.apiUrl, userData);
	}

	public deleteUser(user: User):Observable<number>{
		return this.http.delete<number>(`${this.apiUrl}/${user.id}`)
	}

}
