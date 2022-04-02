import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from 'src/app/interfaces/Project';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

  @Input() project!: any;
  @Output() openEditDialogEmitter = new EventEmitter();

  constructor(
    private projectService: ProjectsService
  ) { }

  ngOnInit(): void {
    console.log(this.project)
  }

  //Comunication using services with observables
  deleteProject(){
    //On delete event (delete button pressed) send id of work selected to delete.
    this.projectService.sendProjectToDelete(this.project);
  }

  //Comunication using child and parent method
  editProject(){
      //Send education to update to parent (education component)
      this.openEditDialogEmitter.emit({project: this.project});
  }


}
