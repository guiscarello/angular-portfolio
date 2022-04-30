import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/shared/loading.service';
import { DialogService } from '../../services/shared/dialog.service';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  
	@Input() id!:string;
	isLoading!: boolean

	constructor(
		private dialogService: DialogService,
		private loadingService: LoadingService
	) {}

	ngOnInit(): void {
		this.loadingService.getLoadingStatus().subscribe({
			next: status => {
				this.isLoading = status;
			}
		});
	}

	closeDialog(){
		this.dialogService.emitEvent();
	}

}
