import { Education } from "../Education";

export interface UpdatedEducationDTO{
	formData: FormData;
	education?: Education | undefined;
}