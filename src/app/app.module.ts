import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { PersonalChatComponent } from './components/personal-chat/personal-chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WebsocketService } from './services/websocket.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TestPageComponent } from './components/test-page/test-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PersonalChatComponent,
    ChatComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    UserProfileComponent,
    TestPageComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    WebsocketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
