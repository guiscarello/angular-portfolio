import { WorkExperience } from "../WorkExperience";

export interface UpdateWorkExperienceDTO{
	formData: FormData;
	work?: WorkExperience | undefined;
}