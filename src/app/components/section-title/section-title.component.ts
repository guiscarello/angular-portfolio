import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TokenService } from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent implements OnInit {

  @Output() addRecordEmitter = new EventEmitter<any>();
  @Input() sectionName!: string;
  @Input() side!: string;
  
  constructor(
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated();
  } 

  addRecord(): void{
    this.addRecordEmitter.emit();
  }

	isAuthenticated(): boolean{
		return sessionStorage.getItem("authenticated") === "true";
	}
  
}
