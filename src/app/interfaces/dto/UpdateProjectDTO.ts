import { Project } from "../Project";

export interface UpdateProjectDTO{
	formData: FormData;
	project: Project | undefined;
}

