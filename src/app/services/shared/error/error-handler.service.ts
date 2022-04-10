import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { messageType } from 'src/app/enums/messageType';
import { MessagesService } from '../messages.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

	constructor(private msgService: MessagesService) { }

	httpErrorHandler(err:HttpErrorResponse){
		if (err.status === 0) {
			//Client side error
			console.log(err.error);
			console.log("An error has ocurred on client side");
			this.msgService.sendAlertMessage({
				message: 'Ha ocurrido un error con el cliente.\n' +
				"Status: " + err.status + ".\n" + 
				"Mensaje: " + err.message + ".", 
				type: messageType.danger
			});
		} else if(err.status === 401){
			console.log("An error has ocurred on server side: ", err.error);
		} else {
			console.log("An error has ocurred on server side: ", err.error);
			this.msgService.sendAlertMessage({
				message: "Ha ocurrido un error en el servidor.\n" +
				"Status: " + err.status + ".\n" + 
				"Mensaje: " + err.message + ".", 
				type: messageType.danger
			});
		}
		return throwError(() => new Error("En error has ocurred, contact to an administrator."));
	}

}
