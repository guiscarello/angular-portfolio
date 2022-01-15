import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AlertMessage } from 'src/app/interfaces/AlertMessage';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private alertSubject = new Subject<AlertMessage>();

  constructor() { }

  sendAlertMessage(message: AlertMessage){
    this.alertSubject.next(message);
  }

  getAlertMessage(): Observable<AlertMessage>{
    return this.alertSubject.asObservable();
  }

}
