import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.router.navigateByUrl('home');
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }
  }

}
