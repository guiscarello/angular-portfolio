import { Component, Input, OnInit } from '@angular/core';
import { WorkExperience } from 'src/app/interfaces/WorkExperience';


@Component({
  selector: 'app-edit-work',
  templateUrl: './edit-work.component.html',
  styleUrls: ['./edit-work.component.scss']
})
export class EditWorkComponent implements OnInit {

  @Input() work!:WorkExperience;
  @Input() id!: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
