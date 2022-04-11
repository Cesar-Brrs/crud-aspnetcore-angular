import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  model: any = {}
  user: User;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
