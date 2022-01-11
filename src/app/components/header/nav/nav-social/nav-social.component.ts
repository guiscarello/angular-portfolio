import { Component, Input, OnInit } from '@angular/core';
import { SocialData } from 'src/app/interfaces/HeaderInterfaces';

@Component({
  selector: 'app-nav-social',
  templateUrl: './nav-social.component.html',
  styleUrls: ['./nav-social.component.scss']
})
export class NavSocialComponent implements OnInit {

  @Input() social!: SocialData;
  
  constructor() { }

  ngOnInit(): void {
  }

}
