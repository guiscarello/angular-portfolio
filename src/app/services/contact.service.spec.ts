import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpErrorResponse } from "@angular/common/http";
import { ContactService } from './contact.service';
import { environment } from 'src/environments/environment';

describe('ContactService', () => {
	
	let underTestService: ContactService;
	let httpTestingController: HttpTestingController;
	let apiUrl: string;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule]
		});
		
		underTestService = TestBed.inject(ContactService);
		httpTestingController = TestBed.inject(HttpTestingController);
		apiUrl = environment.apiUrl + "contacts"
		
	});

	afterEach(() => {
		httpTestingController.verify();
	})

	it('should test if request is post', () => {
		const testFormData: FormData = new FormData();
		/*const token = null;
		testFormData.append("name", "Guillermo Scarello");
		testFormData.append("email", "guillermoscarello@gmail.com");
		testFormData.append("subject", "A testing subject");
		testFormData.append("message", "A testing message");
		testFormData.append("token", token || "");*/
		const responseMessage = "Message was sent succefully"

		underTestService.sendContactData(testFormData).subscribe(message => {
			expect(message).toBe(responseMessage);
		});

		const req = httpTestingController.expectOne(`${apiUrl}`);

		expect(req.request.method).toBe('POST');
		expect(req.request.responseType).toBe('text');

		req.flush(responseMessage);

	});
});
