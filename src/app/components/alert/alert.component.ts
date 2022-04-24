import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagesService } from 'src/app/services/shared/messages.service';

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
	
	message: string = '';
	type: string = '';
	showAlert: boolean = false;
	private alertMessageSubscription!: Subscription;

	timeOutId!: any;

	constructor(
		private messageService: MessagesService 
	) { }
	

	ngOnInit(): void {
		this.alertMessageSubscription = this.messageService.getAlertMessage().subscribe({
			next: message => {
				clearTimeout(this.timeOutId);
				this.message = message.message,
				this.type = message.type
				this.showAlert = true		
				this.timeOutId = setTimeout(() => {
					this.showAlert = false;
				}, 5000);
			}
		});
	}

	closeAlert(){
		this.showAlert = false;
		clearTimeout(this.timeOutId);
	}

	ngOnDestroy(){
		this.alertMessageSubscription.unsubscribe();
	}

}	
