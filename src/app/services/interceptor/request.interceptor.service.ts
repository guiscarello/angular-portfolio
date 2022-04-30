import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoadingService } from '../shared/loading.service';

@Injectable({
	providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor{

	constructor() { }
	
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		
		let token = sessionStorage.getItem('token');

		if(token != null){
			req = req.clone({
				headers: req.headers.set("token", token)
			})
		}

		return next.handle(req);

	}
}
