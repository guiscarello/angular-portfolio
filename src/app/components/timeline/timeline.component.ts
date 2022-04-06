import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @Input() id!: number;
  side: boolean = false;
  toogleDescription: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.sideOfTimeline();
  }

  toggleShowDescription(){
    this.toogleDescription = !this.toogleDescription;
  }

  sideOfTimeline(): void{
    (this.id%2 == 0) ? this.side = true : this.side = false
  }

  get showDescription(){
    return this.toogleDescription;
  }

}
