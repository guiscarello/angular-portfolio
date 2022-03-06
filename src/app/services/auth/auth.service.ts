import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //authenticatedUser: BehaviorSubject<any>;

  constructor(
	private http: HttpClient
  ) { 
	//this.authenticatedUser = new BehaviorSubject(JSON.parse(sessionStorage.getItem("authenticatedUser") || "{}"));
  }

  login(credentials: any): Observable<any>{
	return this.http.post(
		`${environment.apiUrl}/login`, 
		credentials,
		{observe : "response"}).pipe(
			map(
				response => {
					console.log(response.headers.get("Authorization"));
					let authorizationToken = response.headers.get("Authorization");
					if(authorizationToken != null){
						sessionStorage.setItem("Authorization",authorizationToken);
					}
				}
			)
		);
 	}	
	
	getAuthToken(){
		return sessionStorage.getItem("Authorization");
	}

	getRolesFromToken(){
		let token = this.getAuthToken()?.replace("Bearer", "");
		if(token != null){
			let decodedToken = jwt_decode(token);
			console.log(decodedToken);
			return decodedToken;
		}else{
			return null;
		}

	}



}
