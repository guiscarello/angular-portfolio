import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigDirective } from 'src/app/directives/config.directive';
import { SocialsComponent } from '../../config-items/socials/socials.component';
import { StartPageComponent } from '../../config-items/start-page/start-page.component';
import { UsersComponent } from '../../config-items/users/users.component';

@Component({
	selector: 'app-config',
	templateUrl: './config.component.html',
	styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

	@ViewChild(ConfigDirective, {static:true}) configContent! :ConfigDirective;
	sideMenuClosed: boolean = false;
  
	constructor(
		private router: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.router.params.subscribe({
			next: params => {
				let param = params["item"]
				console.log(param)
				this.loadComponent(param);
			}
		})

	}

	loadComponent(configParam: string) {

		const viewContainerRef = this.configContent.viewContainerRef;
		viewContainerRef.clear();
		let componentRef: any;

		if(configParam !== undefined){
			let param = configParam.split(":")[1];
			switch (param) {
				case "users":
					componentRef = viewContainerRef.createComponent<UsersComponent>(UsersComponent);
					break;
				case "socials":
					componentRef = viewContainerRef.createComponent<SocialsComponent>(SocialsComponent);
					break;
				default:
					break;
			}
		} else {
			componentRef = viewContainerRef.createComponent<StartPageComponent>(StartPageComponent);
		}
	}

	closeSideMenu(){
		this.sideMenuClosed = !this.sideMenuClosed;
	}

}
