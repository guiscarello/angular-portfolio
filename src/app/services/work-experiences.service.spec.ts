import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { inject, TestBed } from "@angular/core/testing"
import { environment } from "src/environments/environment";
import { UpdateWorkExperienceDTO } from "../interfaces/dto/UpdateWorkExperienceDTO";
import { WorkExperience } from "../interfaces/WorkExperience";
import { WorkExperiencesService } from "./work-experiences.service"

describe('WorkExperiencesService', () => {
	let apiUrl = environment.apiUrl + "work-experiences";
	let worksForTest: WorkExperience[] = [{
		"id": 1,
		"companyName": "Gooble",
		"companyLogoPath": "http://localhost:4200/assets/img/gooble.png",
		"startDate": "2023-01-06",
		"endDate": "2022-01-06",
		"durationYears": 1,
		"durationMonths": 3,
		"position": "CEO",
		"description": "The standard Lorem Ipsum passage, used since the 1500s. Sunt in culpa qui officia deserunt mollit anim id est laborum.",
		"tel": "0800-BOOGLEadsadasda",
		"currentWork": false
	}, 
	{
		"id": 2,
		"companyName": "Facebook",
		"companyLogoPath": "http://localhost:4200/assets/img/facebook.png",
		"startDate": "2023-01-07",
		"endDate": "2022-01-07",
		"durationYears": 1,
		"durationMonths": 0,
		"position": "Programmer",
		"description": "The standard Lorem Ipsum passage, used since the 1500s. Sunt in culpa qui officia deserunt mollit anim id est laborum.",
		"tel": "0800-Facebook",
		"currentWork": true
	}];
	
	let httpMock: HttpTestingController;
	let underTestService: WorkExperiencesService;

	afterEach(() => {
		httpMock.verify();
	})

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [WorkExperiencesService]
		})
		underTestService = TestBed.inject(WorkExperiencesService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	it('should get all works from api request', () => {
		underTestService.getWorkExperiences().subscribe( workExperiences => {
			expect(workExperiences).toHaveSize(2);
			expect(workExperiences).toBe(worksForTest);
		});
		let request = httpMock.expectOne(`${apiUrl}`);
		expect(request.request.method).toBe('GET');
		request.flush(worksForTest);
	});

	it('should add new work from api request', () => {
		underTestService.addNewWorkExperience(worksForTest[0]).subscribe( workExperience => {
			expect(workExperience).toBe(worksForTest[0]);
		});
		let request = httpMock.expectOne(`${apiUrl}`);
		expect(request.request.method).toBe('POST');
		request.flush(worksForTest[0]);
	});

	it('should update work from api request', () => {
		//TODO: Look how to mock backend response
		let mockFormData: FormData = new FormData();
		mockFormData.append("companyName", "Gooble2");
		let mockUpdateWorkExperienceDTO: UpdateWorkExperienceDTO = {
			formData: mockFormData,
			work: worksForTest[0]
		}
		underTestService.updateWorkExperience(mockUpdateWorkExperienceDTO).subscribe( workExperience => {
			//expect(workExperience).toHaveSize(1);
		});
		let request = httpMock.expectOne(`${apiUrl}/${mockUpdateWorkExperienceDTO.work?.id}`);
		expect(request.request.method).toBe('PUT');
		expect(request.request.body).toBe(mockFormData);
		expect(request.request.url).toBe(`${apiUrl}/1`);
		request.flush(worksForTest[0]);
	});


});