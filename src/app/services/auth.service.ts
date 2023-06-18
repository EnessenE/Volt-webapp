import { Injectable } from '@angular/core';
import { Account } from '../classes/account';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
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
  currentUser: Account | undefined;
  
  private loggedInSubject = new Subject<boolean>();
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient, public router: Router) { }
  // Sign-up
  async signUp(signupRequest: SignupRequest) {
    let api = `${this.endpoint}/register`;
    this.http.post<LoginResult>(api, signupRequest)
      .subscribe(res => {
        console.log("Saving new token")
        localStorage.setItem('volttoken', res.token);

        this.currentUser = res;
        localStorage.setItem('user', JSON.stringify(this.currentUser));

        this.router.navigate(['dash/']);
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
        this.loggedInSubject.next(true);
        this.currentUser = res;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        this.router.navigate(['dash/']);
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
    var signedin = authToken !== null ? true : false;
    return signedin;

  }

  get token(): string | null {
    let authToken = localStorage.getItem('volttoken');
    return authToken;
  }

  get currentAccount(): Account | null {
    var userData = localStorage.getItem('user')!;
    let currentUser:Account = JSON.parse(userData);
    return currentUser!;
  }

  doLogout() {
    this.loggedInSubject.next(false);
    let removeToken = localStorage.removeItem('volttoken');
    localStorage.removeItem('user');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

}