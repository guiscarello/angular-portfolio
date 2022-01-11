import { Component, Input, OnInit } from '@angular/core';
import { Education } from '../../../interfaces/Education';

@Component({
  selector: 'app-education-item',
  templateUrl: './education-item.component.html',
  styleUrls: ['./education-item.component.scss']
})
export class EducationItemComponent implements OnInit {

  @Input() education!: Education;
  constructor() { }

  ngOnInit(): void {
  }

}
