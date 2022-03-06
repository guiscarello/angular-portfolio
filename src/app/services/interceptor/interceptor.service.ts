import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

	constructor(private authService: AuthService) { }
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		
		let token = this.authService.getAuthToken();

		if(token != null){
			req = req.clone({
				headers: req.headers.set("Authorization", token)
			})	
		}
		console.log("Interceptor: " + req.headers.get("Authorization"))
		return next.handle(req);
	}
}
