import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { response } from 'express';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
	private http: HttpClient,
	private router: Router
  ) { 

  }

  login(credentials: any): Observable<any>{
	return this.http.post(
		environment.apiUrl + "login", 
		credentials,
		{observe : "response"}).pipe(
			map(
				response => {
					console.log(response.headers.get("token"));
					let jwtToken = response.headers.get("token");
					let authenticated = response.headers.get("authenticated");
					if(jwtToken != null){
						sessionStorage.setItem("token", jwtToken);
					}
					if(authenticated != null){
						sessionStorage.setItem("authenticated", authenticated);
					}
				}
			)
		);
 	}	

	logout(): Observable<any>{
		//sessionStorage.clear();
		//this.reloadRoute("/main");
		return this.http.get(
				environment.apiUrl + "logout", 
				{observe: "response"}
			).pipe(
				map(
					() => {
						sessionStorage.clear();
					}
				)
			)
	}

	authenticated(): boolean{
		let authenticated = sessionStorage.getItem("authenticated");
		return authenticated === "true";
	}

	reloadRoute(route: string) {
		this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
			this.router.navigate([route]);
		});
	}


}
