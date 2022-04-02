import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Skill } from '../../../interfaces/Skill';
import { EChartsOption, graphic } from 'echarts';
import { SkillsService } from 'src/app/services/skills.service';

@Component({
	selector: 'app-skill-item',
	templateUrl: './skill-item.component.html',
	styleUrls: ['./skill-item.component.scss']
})
export class SkillItemComponent implements OnInit {

	@Input() skill!: Skill;
	@Output() openEditDialogEmitter = new EventEmitter();
	gaugeData!: Array<any>;
	chartOptions!: EChartsOption;

	constructor(
		private skillsService: SkillsService
	) { 
	}

	ngOnInit(): void {
		this.gaugeData = [{
			value: this.skill.levelPercentage,
		}];
		this.chartOptions = {
			series: [
			  {
				type: 'gauge',
				startAngle: 90,
				endAngle: -270,
				pointer: {
				  show: false
				},
				progress: {
				  show: true,
				  overlap: false,
				  roundCap: true,
				  clip: false,
				  itemStyle: {
					borderWidth: 1,
					borderColor:  'white',
					color: new graphic.LinearGradient(0, 0, 0, 1, [
						{
						  offset: 0,
						  color: '#0ea8a0'
						},
						{
						  offset: 1,
						  color: '#003f52'
						}
					])
				  }
				},
				axisLine: {
				  lineStyle: {
					width: 20
				  }
				},
				splitLine: {
				  show: false,
				  distance: 0,
				  length: 10
				},
				axisTick: {
				  show: false
				},
				axisLabel: {
				  show:false,
				  distance: 50
				},
				data: this.gaugeData,
				title: {
				  fontSize: 14,
				},
				detail: {
					show: false
				}
			  }
			]
		};
	}

	//Comunication using services with observables
	deleteWork(){
	  //On delete event (delete button pressed) send id of work selected to delete.
	  this.skillsService.sendSkillToDelete(this.skill);
	}
  
	//Comunication using child and parent method
	editWork(){
		//Send work to update to parent (work experiences component)
		this.openEditDialogEmitter.emit({skill: this.skill});
	}

}


