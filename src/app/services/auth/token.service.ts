import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { JwtToken } from 'src/app/interfaces/JwtToken';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  rolesFromToken(): string[] | null{
    let token = sessionStorage.getItem("token")
		if(token != null){
			let decodedToken: JwtToken = jwt_decode(token);
			//console.log("token", decodedToken);
			let roles = decodedToken.roles.map(role => role.authority);
			return roles;	
		}
		return null;
	}
}
