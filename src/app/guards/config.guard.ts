import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { messageType } from '../enums/messageType';
import { TokenService } from '../services/auth/token.service';
import { MessagesService } from '../services/shared/messages.service';

@Injectable({
	providedIn: 'root'
})
export class ConfigGuard implements CanActivate {

	constructor(	
		private tokenService: TokenService,
		private messageService: MessagesService
	){
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		let roles = this.tokenService.rolesFromToken();
			if(roles?.includes('ROLE_ADMIN')){
				console.log(roles);
				return true;
			}
			this.messageService.sendAlertMessage({
				type: messageType.danger,
				message: "No tiene autorizacion para utilizar esta funcionalidad"
			});
			return false;
	}
	
}
