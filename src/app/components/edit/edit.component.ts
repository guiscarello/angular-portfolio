import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TokenService } from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

	@Output() editEventEmitter = new EventEmitter<any>();
	@Output() deleteEventEmitter = new EventEmitter<any>();

	constructor(
		private tokenService: TokenService
	) { }

	ngOnInit(): void {
		this.isAuthenticated();
	}

	onEditWork(){
		this.editEventEmitter.emit();
	}

	onDeleteWork(){
		this.deleteEventEmitter.emit();
	}

	isAuthenticated(): boolean{
		return sessionStorage.getItem("authenticated") === "true";
	}

}
