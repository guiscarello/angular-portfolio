import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../interfaces/Skill';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  apiUril = "http://localhost:5000/skills";

  constructor(
    private http: HttpClient
  ) { }

  getSkills(): Observable<Skill[]>{
    return this.http.get<Skill[]>(this.apiUril)
  }

}
