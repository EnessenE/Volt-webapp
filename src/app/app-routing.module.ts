import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalChatComponent } from './components/personal-chat/personal-chat.component';
import { AuthGuard } from './shared/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chat/:id', component: PersonalChatComponent, canActivate: [AuthGuard] },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
