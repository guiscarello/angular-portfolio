import { Skill } from "./Skill";

export interface Project{
	id: number;
	title: string;
	startDate: string;
	endDate: string;
	description: string;
	mainImage: string;
	additionalImages:string[];
	skills: Skill[];
}