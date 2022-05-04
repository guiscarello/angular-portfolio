import { Component,  HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { SocialData } from 'src/app/interfaces/HeaderInterfaces';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { result } from 'underscore';
import { HeaderService } from '../../services/header.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	socialData?: SocialData[];
	changeNavbarColor: boolean = false;

	constructor(
		private headerService: HeaderService,
		private authService: AuthenticationService,
	) { }

	ngOnInit(): void {
		this.headerService.getSocialData().subscribe(
			data => this.socialData = data
		);
		this.isAuthenticated();
	}	

	isAuthenticated(): boolean {
		return this.authService.authenticated();
	}

	logout(){
		this.authService.logout().subscribe();
	}

	@HostListener('window:scroll', ['$event'])
	onScroll(e: Event){
		//console.log(window.scrollY)
		if(window.scrollY >= 70){
			this.changeNavbarColor = true;
		} else {
			this.changeNavbarColor = false;
		}
		
	}


}
