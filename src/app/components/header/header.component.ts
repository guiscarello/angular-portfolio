import { Component, OnInit } from '@angular/core';
import { SocialData } from 'src/app/interfaces/HeaderInterfaces';
import { HeaderService } from '../../services/header.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	socialData?: SocialData[];

	constructor(
		private headerService: HeaderService
	) { }

	ngOnInit(): void {
		this.headerService.getSocialData().subscribe(
			data => this.socialData = data
		);
	}	

}
