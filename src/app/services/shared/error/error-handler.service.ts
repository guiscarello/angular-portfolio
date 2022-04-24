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

	httpErrorHandler(err:HttpErrorResponse, deleteMsg?: any){
		if (err.status === 0) {
			//Client side error
			console.log(err.error);
			console.log("An error has ocurred on client side");
			this.msgService.sendAlertMessage({
				message: "No se ha podido conectar con el servidor, intente mas tarde.", 
				type: messageType.danger
			});
		} else if(err.status === 401){
			console.log("Unahutorized: ", err.error);
			this.msgService.sendAlertMessage({
				message:  err.status + '. No autorizado', 
				type: messageType.danger
			});
		} else if(err.status === 403){
			console.log("An error has ocurred on server side: ", err.error);
			this.msgService.sendAlertMessage({
				message:  err.status + '. No tiene permisos suficientes para realizar esta accion.', 
				type: messageType.danger
			});
		} else {
			console.log("An error has ocurred on server side: ", err.error);
			if(deleteMsg !== undefined){
				this.msgService.sendAlertMessage({
					message:  err.status + '. ' + deleteMsg + '.', 
					type: messageType.danger
				});
			} else {
				this.msgService.sendAlertMessage({
					message:  err.status + '. Ha ocurrido un error en el servidor. Por favor contacte el administrador.', 
					type: messageType.danger
				});
			}
			
		}
		return throwError(() => new Error("En error has ocurred, contact to an administrator."));
	}

}
