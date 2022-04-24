import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

	windowWidth: number;

	constructor() { 
		this.windowWidth = window.innerWidth;
	}

	ngOnInit(): void {

	}

	@HostListener('window:resize', ['$event'])
	onResize(event:any) {
		//console.log(event.target.innerWidth)
		this.windowWidth = event.target.innerWidth;
	}


}
