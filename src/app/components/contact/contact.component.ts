import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';


@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

	contactForm!: FormGroup;
	siteKey: string = "6LeAWxQfAAAAABZiDXnTGbgkpYJ-biaBHIVyLr6s";
	token: string | null = null;

	constructor(
		private fb: FormBuilder,
		private contactService: ContactService	
	) { }

	ngOnInit(): void {
		this.contactForm = this.fb.group({
			name: [''],
			email: [''],
			subject: [''],
			recaptcha:[''],
			message: ['']
		})
	} 

	handleSuccess(token: string){
		this.token = token;
		
	}

	submitDisabled(): boolean{
		return this.token == null;
	}

	onSubmit(){
		let formData = new FormData();

		/*formData.append("name");
		formData.append("email")
		formData.append("subject")
		formData.append("message")*/
		formData.append("captcha", this.contactForm.get('recaptcha')?.value);
		formData.append("token", this.token || "");
		this.contactService.sendContactData(formData).subscribe({
			next: value => console.log(value),
			error: err => console.log(err)
		});
	}

}
