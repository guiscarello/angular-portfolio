import { Component, OnInit } from '@angular/core';
import { EducationService } from '../../services/education.service';
import { Education } from '../../interfaces/Education';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  education: Education[] = []; 

  constructor(
    private educationService: EducationService
  ) { }

  ngOnInit(): void {
    this.educationService.getEducation().subscribe(
      education => {
        //console.log(education);
        this.education = education;
      }
    );
  }

}
