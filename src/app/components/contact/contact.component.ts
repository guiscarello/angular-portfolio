import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
import { messageType } from 'src/app/enums/messageType';
import { ContactService } from 'src/app/services/contact.service';
import { ErrorHandlerService } from 'src/app/services/shared/error/error-handler.service';
import { MessagesService } from 'src/app/services/shared/messages.service';
import { environment } from 'src/environments/environment';


@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

	contactForm!: FormGroup;
	siteKey: string = environment.reCaptchaSiteKey;
	token: string | null = null;
	@ViewChild('captchaElem') captchaElem!: ReCaptcha2Component;
	
	constructor(
		private fb: FormBuilder,
		private contactService: ContactService,
		private messageService: MessagesService,
		private errorHandlerService: ErrorHandlerService
	) { }

	ngOnInit(): void {
		this.contactForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', Validators.required],
			subject: ['', Validators.required],
			recaptcha:[''],
			message: ['', Validators.required]
		})
	} 

	handleSuccess(token: string){
		this.token = token;
	}

	submitDisabled(): boolean{
		return this.token == null;
	}

	onSubmit(){
		if(this.contactForm.valid){
			let formData = new FormData();
			console.log(this.token)
			formData.append("name", this.contactForm.get('name')?.value);
			formData.append("email", this.contactForm.get('email')?.value)
			formData.append("subject", this.contactForm.get('subject')?.value)
			formData.append("message", this.contactForm.get('message')?.value)
			//formData.append("captcha", this.contactForm.get('recaptcha')?.value);
			formData.append("token", this.token || "");
			this.contactService.sendContactData(formData).subscribe({
				next: response => {
					//console.log(response);
					this.contactForm.reset('');
					this.captchaElem.reloadCaptcha();
					this.messageService.sendAlertMessage(
						{
							message: response,
							type: messageType.success
						}
					)
				},
				error: err => {
					console.log(err);
					this.errorHandlerService.httpErrorHandler(
						err, "Algo ha salido mal en el envio, verifique si el email que ha escrito es válido y existente."
					)
					
				}
			});
		} else {
			Object.keys(this.contactForm.controls).forEach(
				field => {
					const control = this.contactForm.get(field);
					control?.markAsTouched({onlySelf:true});
				}
			);
		}
		
	}

	isFieldInValid(field: string){
		if (this.contactForm.get(field)?.untouched){
			return undefined;
		} else if(!this.contactForm.get(field)?.valid && this.contactForm.get(field)?.touched){
			return true;
		} else {
			return false
		}
	}

	displayFieldClass(field: string){
		if(this.isFieldInValid(field) == undefined){
			return "";
		} else if(this.isFieldInValid(field)){
			return "is-invalid";
		} else {
			return "valid";
		}
	}

}
