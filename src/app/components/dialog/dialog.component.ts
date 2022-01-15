import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from '../../services/shared/dialog.service';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  
	@Input() id!:string;

	constructor(
		private dialogService: DialogService
	) {}

	ngOnInit(): void {

	}

	closeDialog(){
		this.dialogService.emitEvent();
	}

}
