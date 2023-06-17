import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupRequest } from 'src/app/classes/signup-request';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signupForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }
  ngOnInit() {}

  async registerUser() {
    var data = this.signupForm.value;

    var signupRequest = new SignupRequest();

    signupRequest.encryptedPassword = data.password;
    signupRequest.username = data.username;

    await this.authService.signUp(signupRequest);
    this.signupForm.reset();
    this.router.navigate(['chat','1']);
  }
}