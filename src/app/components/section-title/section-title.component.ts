import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkExperiencesService } from 'src/app/services/work-experiences.service';

@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent implements OnInit {

  @Output() addRecordEmitter = new EventEmitter<any>();
  @Input() sectionName: string = "";
  
  constructor(
    private workService: WorkExperiencesService
  ) { }

  ngOnInit(): void {
  } 

  addRecord(): void{
    this.addRecordEmitter.emit();
  }

}
