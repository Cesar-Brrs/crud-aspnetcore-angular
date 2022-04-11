import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.Api_Url;
  user: User;
  usersChanged = new Subject<User[]>();
  private editModeSource = new ReplaySubject<boolean>(1);
  private userEditSource = new ReplaySubject<User>(1);
  editMode$ = this.editModeSource.asObservable();
  userEdit$ = this.userEditSource.asObservable();

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(`${this.baseUrl}api/user`);
  }

  createUser(user: User) {
    return this.http.post(`${this.baseUrl}api/user/register`, user);
  }

  updateUser(user: User) {
    return this.http.put(`${this.baseUrl}api/user/updateUser/${user.id}`, user);
  }

  deleteUser(user: User) {
    return this.http.put(`${this.baseUrl}api/user/deleteUser/${user.id}`, user);
  }

  setEditMode(edit: boolean) {
    this.editModeSource.next(edit);
  }

  setUserEdit(user: User) {
    this.userEditSource.next(user);
  }
}
