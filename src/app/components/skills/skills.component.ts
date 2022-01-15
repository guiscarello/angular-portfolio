import { Component, OnInit } from '@angular/core';
import { Skill } from '../../interfaces/Skill';
import { SkillsService } from '../../services/skills.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  public skills!: Skill[]

  constructor(
    private skillService: SkillsService
  ) { }

  ngOnInit(): void {
    this.skillService.getSkills().subscribe({
      next: (skills) => this.skills = skills
    });
  }

}
