import { Component, OnInit } from '@angular/core';
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

	constructor(
		private headerService: HeaderService,
		private authService: AuthenticationService
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

}
