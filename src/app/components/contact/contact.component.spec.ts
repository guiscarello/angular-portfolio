import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ContactService } from 'src/app/services/contact.service';
import { environment } from 'src/environments/environment';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
	let component: ContactComponent;
	let fixture: ComponentFixture<ContactComponent>;
	let fb: FormBuilder;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports:[
				FormsModule, 
				ReactiveFormsModule, 
				HttpClientTestingModule			],
			declarations: [ ContactComponent ]
		})
		.compileComponents();
	});

	beforeEach(async () => {
		fixture = TestBed.createComponent(ContactComponent);
		component = fixture.componentInstance;
        setTimeout(function () {
            fixture.detectChanges();
        }, 2000);
		component.ngOnInit();
	});

	it('should invalid the email input if email is not valid', () => {
		component.contactForm.controls['email'].setValue('');
		setTimeout(function () {
            fixture.detectChanges();
        }, 2000);
		expect(component.contactForm.controls['email'].invalid).toBe(true);
	});
	it('should valid the email input if email is valid', () => {
		component.contactForm.controls['email'].setValue('guillermoscarello@gmail.com');
		setTimeout(function () {
            fixture.detectChanges();
        }, 2000);
		expect(component.contactForm.controls['email'].valid).toBe(true);
	});

	it('should invalid the form if any of the form input is missing', () => {
		component.contactForm.controls['name'].setValue('');
		setTimeout(function () {
            fixture.detectChanges();
        }, 2000);
		expect(component.contactForm.valid).toBe(false);
	})
	it('should validate the form if all inputs are present', () => {
		component.contactForm.setValue({
			name: "Guillermo Scarello",
			email: "guillermoscarello@gmail.com",
			subject: "A test subject",
			recaptcha: "token",
			message: "A message subject"
		})
		setTimeout(function () {
            fixture.detectChanges();
        }, 2000);
		expect(component.contactForm.valid).toBe(true);
	});

	
});

