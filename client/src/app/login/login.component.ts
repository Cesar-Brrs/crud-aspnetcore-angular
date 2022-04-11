import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild("f") loginForm: NgForm;
  user: User;
  error: any = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(res => {
      this.router.navigateByUrl('home');
    }, error => {
      console.log(error.error)
      this.error = error.error;
    });
  }
}
