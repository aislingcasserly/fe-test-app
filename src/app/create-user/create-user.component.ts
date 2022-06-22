import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../api-service.service';
import { RowHeightCache } from '@swimlane/ngx-datatable/release/utils';

@Component({
  selector: 'exads-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {



  userForm: FormGroup;
  userList: any = [];
  nameTaken: boolean = false;
  usernameToCheck: string = "";

  constructor( private router: Router, private activeRoute: ActivatedRoute, private location: Location, private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit() {
    this.getUsers();
    this.userForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  getUsers(): void{
    this.apiService.getUsers().subscribe(data =>{
      this.userList = data["data"].users;
    }); 
}

  cancelNewUser(): void {
    this.router.navigate(['/users'])
  }

  addNewUser(): void {
    let body = {
      user:{
        username: this.userForm.controls["username"].value,
        first_name: this.userForm.controls["firstName"].value,
        last_name: this.userForm.controls["lastName"].value,
        email: this.userForm.controls["email"].value,
        id_status: 1
      }
    }
    this.apiService.postUser(body).subscribe((data) => {
      this.router.navigate(['/users'])
    })
  }

  checkIsUserTaken(): void {
    let userExists = false;
    for(let i = 0; i < this.userList.length; i++){
      if(this.usernameToCheck.trim().toLowerCase() === this.userList[i].username.toString().toLowerCase()){
        userExists = true;
      }
    }

    if(this.userForm.controls["username"].value.toString().includes("{") || this.userForm.controls["username"].value.toString().includes("}")
    || this.userForm.controls["username"].value.toString().includes('"') || this.userForm.controls["username"].value.toString().includes("[") 
    || this.userForm.controls["username"].value.toString().includes("]") || this.userForm.controls["username"].value.toString().includes(".") || this.userForm.controls["username"].value.toString().includes("!")){
      this.userForm.controls["username"].setErrors({'hasSpecialChar': true})
    }
    else if(userExists){
      this.userForm.controls["username"].setErrors({'usernameTaken': true})
      this.nameTaken = true;
    }
    else{
      this.nameTaken = false;
      this.userForm.controls["username"].markAsUntouched()
    }
  }

  displayErrorMessage(type: string): string {
    if(type === "username"){
      if (this.userForm.controls["username"].hasError('required')) {
        return 'You must enter a username';
      }
      else if(this.userForm.controls["username"].value.length < 3){
        return 'Length must be greater than 2 characters';
      }
      else if(this.userForm.controls["username"].hasError('hasSpecialChar')){
        return 'Username cannot contain the following special characters: {}"[].!'
      }
      else if(this.userForm.controls["username"].hasError('usernameTaken')){
        return 'Username is already taken';
      }
    }
    if(type === "firstName") {
      if (this.userForm.controls["firstName"].hasError('required')) {
        return 'You must enter a first name';
      }
    }
    if(type === "email") {
      if (this.userForm.controls["email"].hasError('required')) {
        return 'You must enter an email';
      }
      else if(this.userForm.controls["email"].hasError('email')){
        return 'Not a valid email';
      }
    }
  }
}
