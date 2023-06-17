import { Injectable } from '@angular/core';
import { Account } from '../classes/account';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../classes/login-request';
import { LoginResult } from '../classes/login-result';
import { SignupRequest } from '../classes/signup-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint: string = environment.apiServer + '/v1/auth';
  headers: any;// = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) { }
  // Sign-up
  async signUp(signupRequest: SignupRequest) {
    let api = `${this.endpoint}/register`;
    this.http.post<LoginResult>(api, signupRequest)
      .subscribe(res => {
        console.log("Saving new token")
        localStorage.setItem('volttoken', res.token);
        // this.getUserProfile(res.token).subscribe((res) => {
        //   this.currentUser = res;
        //   this.router.navigate(['user-profile/' + res.msg._id]);
        // });
      });
  }

  // Sign-in
  signIn(user: LoginRequest) {
    return this.http.post<any>(`${this.endpoint}/login`, user)
      .subscribe(res => {
        console.log("Saving login token");
        localStorage.setItem('volttoken', res.token);
        // this.getUserProfile(res.token).subscribe((res) => {
        //   this.currentUser = res;
        //   this.router.navigate(['user-profile/' + res.msg._id]);
        // });
      });
  }

  getToken() {
    return localStorage.getItem('volttoken');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('volttoken');
    return authToken !== null ? true : false;
  }

  get token(): string | null {
    let authToken = localStorage.getItem('volttoken');
    return authToken;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('volttoken');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}