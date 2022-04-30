import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

	loadingStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor() { 
	}

	setLoadingStatus(status: boolean){
		this.loadingStatus.next(status);
	}

	getLoadingStatus(): Observable<boolean>{
		return this.loadingStatus.asObservable();
	}

}
