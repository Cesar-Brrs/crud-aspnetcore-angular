import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.setCurrentUser();
    this.userService.setEditMode(false);
    this.userService.setUserEdit(null);
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.authService.setCurrentUser(user);
    }
  }
}
