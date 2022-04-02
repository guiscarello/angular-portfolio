import { Skill } from "../Skill";

export interface UpdateSkillDTO{
	formData: FormData;
	skill?: Skill | undefined;
}