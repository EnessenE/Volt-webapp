import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/classes/login-request';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  signinForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signinForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }
  ngOnInit() { }
  loginUser() {
    var loginRequest = new LoginRequest();
    loginRequest.username = this.signinForm.value.username;
    loginRequest.encryptedPassword = this.signinForm.value.password;
    this.authService.signIn(loginRequest);
  }
}
