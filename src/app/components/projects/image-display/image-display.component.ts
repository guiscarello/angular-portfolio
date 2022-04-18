import { Component, Input, OnInit, Type } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { forkJoin, Observable } from 'rxjs';
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
		for(let i = 0; i < this.project?.photos.length; i++){
			console.log("entro")
			let ref = this.storage.ref(this.project?.photos[i].projectPhotoPath);
			this.projectImagesUrl?.push(ref?.getDownloadURL());
			
		}
		console.log(this.projectImagesUrl);
		if(this.projectImagesUrl !== undefined){
			console.log(this.project?.photos.length)
			console.log(this.projectImagesUrl)
			forkJoin(this.projectImagesUrl).subscribe(
				imagesUrl => {
					this.images = imagesUrl;
					console.log(imagesUrl)
				}
			);
		}
	}

	showImageDisplay($event: any){
		console.log($event)
	}

	closeImageDisplay(){
		this.dialogService.emitEvent();
	}

}
