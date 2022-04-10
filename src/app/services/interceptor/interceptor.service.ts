import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

	constructor() { }
	
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		
		/*if(req instanceof HttpRequest){
			console.log("REquest")
		}
		if(req instanceof HttpResponse){
			console.log("Respnse")
		}*/


		let token = sessionStorage.getItem('token');
		//console.log("token: ", token)
		if(token != null){
			req = req.clone({
				headers: req.headers.set("token", token)
			})	
		}
		return next.handle(req);
		/*return next.handle(req).pipe(
			map( event => {
				if(event instanceof HttpResponse){
					console.log(event.headers.get("Authorization"))
					return event;
				} 
				return event;
			})
		);*/

	}
}
