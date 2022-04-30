import { Component, Input, OnInit, Type } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Project } from 'src/app/interfaces/Project';
import { DialogService } from 'src/app/services/shared/dialog.service';


@Component({
	selector: 'app-image-display',
	templateUrl: './image-display.component.html',
	styleUrls: ['./image-display.component.scss']
})
export class ImageDisplayComponent implements OnInit {

	@Input() project!: any; 

	projectImagesUrl: Array<Observable<string | null>> = new Array();
	images: Array<string | null> = new Array();
	
	constructor(
		private dialogService: DialogService,
		private storage: AngularFireStorage
	) { }

	ngOnInit(): void {

	}

	ngOnChanges(){
		this.images = [];
		this.projectImagesUrl = []
		console.log("this project", this.project)
		for(let i = 0; i < this.project?.photos.length; i++){
			let ref = this.storage.ref(this.project?.photos[i].projectPhotoPath);
			this.projectImagesUrl?.push(ref?.getDownloadURL());
			
		}
		console.log("project images url", this.projectImagesUrl);
		if(this.projectImagesUrl !== undefined){
			forkJoin(this.projectImagesUrl).subscribe(
				imagesUrl => {
					this.images = imagesUrl;
				}
			);
		}
	}

	closeImageDisplay(){
		this.dialogService.emitEvent();
	}

}
