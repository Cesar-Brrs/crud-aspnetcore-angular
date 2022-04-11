import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/_models/user';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  genders = ['Masculino', 'Femenino'];
  editMode: boolean = false;
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.editMode$.subscribe(res => this.editMode = res);
    console.log(this.editMode);
    this.initializeForm();
  }

  private initializeForm() {
    let userId = 0;
    let userUsername = '';
    let userEmail = '';
    let userPassword = '';
    let userConfirmPassword = '';
    let userStatus = true;
    let userGender = 'Masculino';
    let userCreationDate = new Date(Date.now());

    if (this.editMode) {
      let user: User;
      this.userService.userEdit$.subscribe(res => user = res);
      userId = user.id;
      userUsername = user.username;
      userEmail = user.email;
      userStatus = user.status;
      userGender = user.gender;
      userCreationDate = new Date(user.creationDate);
    }

    this.registerForm = new FormGroup({
      id: new FormControl(userId),
      username: new FormControl(userUsername, [Validators.required, Validators.minLength(7)]),
      email: new FormControl(userEmail, [Validators.required, Validators.email]),
      password: new FormControl(userPassword, [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$%^&*-]).{8,}$')
      ]),
      confirmPassword: new FormControl(userConfirmPassword, [Validators.required]),
      status: new FormControl({ value: userStatus, disabled: this.editMode }),
      gender: new FormControl(userGender),
      creationDate: new FormControl({ value: userCreationDate.toLocaleDateString(), disabled: true })
    },
    CustomValidators.mustMatch('password', 'confirmPassword')
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.userService.createUser(this.registerForm.value).subscribe(() => {
        this.registerForm.reset({
          status: true,
          gender: 'Hombre',
          createdDate: new Date(Date.now()).toLocaleDateString()
        })
        this.router.navigateByUrl('home');
      }, error => {
        this.errorMessage = error.error
      });
    }
  }

  onEdit() {
    this.userService.updateUser(this.registerForm.value).subscribe(res => {
      console.log(res);
      this.router.navigateByUrl('home');
    });
  }

  ngOnDestroy(): void {
    this.userService.setEditMode(false);
    this.userService.setUserEdit(null);
  }
}
