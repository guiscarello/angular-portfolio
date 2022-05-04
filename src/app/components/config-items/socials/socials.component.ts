import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { messageType } from 'src/app/enums/messageType';
import { SocialData } from 'src/app/interfaces/HeaderInterfaces';
import { UserService } from 'src/app/services/config/user.service';
import { HeaderService } from 'src/app/services/header.service';
import { LoadingService } from 'src/app/services/shared/loading.service';
import { MessagesService } from 'src/app/services/shared/messages.service';

@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.scss']
})
export class SocialsComponent implements OnInit {

	socials!: SocialData[];
	isLoading!: boolean;
	socialForm: FormGroup;
	showForm: boolean = false;

	constructor(
		private headerService: HeaderService,
		private fb: FormBuilder,
		private messageService: MessagesService,
    private loadingService: LoadingService
	) {
		this.socialForm = this.fb.group({
			name:['', [Validators.required]],
			class: ['', [Validators.required]],
			link:['', Validators.required]
		})
	 }

	ngOnInit(): void {
		this.headerService.getSocialData().subscribe(socials => {
			this.socials = socials
			console.log(socials)
		});
    this.loadingService.getLoadingStatus().subscribe({
			next: status => {
				//console.log("loading status: ", status)
				this.isLoading = status;
			}
		});
	}

	onSubmit(){
		if(this.socialForm.valid){
			let formData: FormData = new FormData();
			formData.append("name", this.socialForm.get('name')?.value);
			formData.append("class", this.socialForm.get('class')?.value);
			formData.append("link", this.socialForm.get('link')?.value);
     		this.loadingService.setLoadingStatus(true);
			this.headerService.createNewSocial(formData).subscribe({
				next: social =>{ 
					this.socials.push(social);
					this.socialForm.reset();
					this.messageService.sendAlertMessage({
						type: messageType.success,
						message: "Red social creada con exito"
					})
				},
				error: err => console.log(err)
			
			});
		} else {
			Object.keys(this.socialForm.controls).forEach(
				field => {
					const control = this.socialForm.get(field);
					control?.markAsTouched({onlySelf:true});
				}
			);
		}
	}


	deleteSocial(social: SocialData){
		if(confirm("Esta seguro que desea borrar el registro?")){
			this.headerService.deleteSocial(social).subscribe({
				next: id => {
					this.socials = this.socials.filter(social => social.id !== id);
					this.messageService.sendAlertMessage({
						type: messageType.success,
						message: `Red social con id ${id} eliminada con exito`
					})
				},
				error: err => { 
					console.log(err)
				}
			})
		}
	}

	toggleSocialForm(){
		this.showForm = !this.showForm;
	}

	isFieldInValid(field: string){
		if (this.socialForm.get(field)?.untouched){
			return undefined;
		} else if(!this.socialForm.get(field)?.valid && this.socialForm.get(field)?.touched){
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
