import { Component, Input, OnInit } from '@angular/core';
import { Skill } from '../../../interfaces/Skill';

@Component({
  selector: 'app-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.scss']
})
export class SkillItemComponent implements OnInit {

  @Input() skill!: Skill;

  constructor() { }

  ngOnInit(): void {
  }

}
