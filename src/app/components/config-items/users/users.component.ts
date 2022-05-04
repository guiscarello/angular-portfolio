import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { messageType } from 'src/app/enums/messageType';
import { User } from 'src/app/interfaces/User';
import { UserService } from 'src/app/services/config/user.service';
import { LoadingService } from 'src/app/services/shared/loading.service';
import { MessagesService } from 'src/app/services/shared/messages.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

	users!: User[];
	isLoading!: boolean;
	userForm: FormGroup;
	showForm: boolean = false;

	constructor(
		private userService: UserService,
		private fb: FormBuilder,
		private messageService: MessagesService,
		private loadingService: LoadingService
	) {
		this.userForm = this.fb.group({
			username:['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.pattern(".{8,32}")]],
			roles:['', Validators.required]
		})
	 }

	ngOnInit(): void {
		this.userService.getAllUsers().subscribe(users => {
			this.users = users
			console.log(users)
		});
		this.loadingService.getLoadingStatus().subscribe({
			next: status => {
				//console.log("loading status: ", status)
				this.isLoading = status;
			}
		});
	}

	onSubmit(){
		console.log(this.userForm.get('roles')?.value)
		if(this.userForm.valid){
			let formData: FormData = new FormData();
			formData.append("username", this.userForm.get('username')?.value);
			formData.append("password", this.userForm.get('password')?.value);
			formData.append("roles[]", this.userForm.get('roles')?.value);
			this.loadingService.setLoadingStatus(true);
			this.userService.createNewUser(formData).subscribe({
				next: user =>{ 
					this.users.push(user);
					this.userForm.reset('');
					this.messageService.sendAlertMessage({
						type: messageType.success,
						message: "Usuario creado con exito"
					})
				},
				error: err => console.log(err)
			
			});
		} else {
			Object.keys(this.userForm.controls).forEach(
				field => {
					const control = this.userForm.get(field);
					control?.markAsTouched({onlySelf:true});
				}
			);
		}
	}
	//TODO: EDIT RECORDS, CREATE AND PASS DTO OBJECT
	/*editUser(user: User){
		console.log(user)
	}*/

	deleteUser(user: User){
		if(confirm("Esta seguro que desea borrar el registro?")){
			this.userService.deleteUser(user).subscribe({
				next: id => {
					this.users = this.users.filter(user => user.id !== id);
					this.messageService.sendAlertMessage({
						type: messageType.success,
						message: `Usuario con id ${id} eliminado con exito`
					})
				},
				error: err => {
					console.log(err)
				}
			})
		}
		
	}

	toogleUserForm(){
		this.showForm = !this.showForm;
	}

	isFieldInValid(field: string){
		if (this.userForm.get(field)?.untouched){
			return undefined;
		} else if(!this.userForm.get(field)?.valid && this.userForm.get(field)?.touched){
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
