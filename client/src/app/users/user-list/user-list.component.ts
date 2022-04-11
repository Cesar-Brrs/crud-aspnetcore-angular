import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.userService.usersChanged.next(this.users.slice());
      console.log(users);
    })
  }

  onEdit(user: User) {
    this.userService.setUserEdit(user);
    this.userService.setEditMode(true);
    this.router.navigateByUrl('register');
  }

  onDelete(user: User) {
    user.status = false;
    this.userService.deleteUser(user).subscribe(res => {
      this.fetchUsers();
    })
  }
}
