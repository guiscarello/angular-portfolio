import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse
} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { LoadingService } from '../shared/loading.service';

@Injectable()
export class ResponseInterceptorService implements HttpInterceptor {

	constructor(		
		private loadingService: LoadingService
	) {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(map(
			(event: HttpEvent<any>) => {
				if(event instanceof HttpResponse){
					this.loadingService.setLoadingStatus(false);
				}
				return event;
			}
		));
	}
}
