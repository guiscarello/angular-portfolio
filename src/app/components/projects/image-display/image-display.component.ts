import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/interfaces/Project';
import { DialogService } from 'src/app/services/shared/dialog.service';

@Component({
	selector: 'app-image-display',
	templateUrl: './image-display.component.html',
	styleUrls: ['./image-display.component.scss']
})
export class ImageDisplayComponent implements OnInit {

	@Input() project!: any; 

	constructor(
		private dialogService: DialogService
	) { }

	ngOnInit(): void {
		
	}
	ngOnChanges(){
		console.log(this.project)
	}

	showImageDisplay($event: any){
		console.log($event)
	}

	openImageDisplay($event: any){
		console.log("image display");
	}

	closeImageDisplay(){
		this.dialogService.emitEvent();
	}

}
