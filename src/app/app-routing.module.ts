import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalChatComponent } from './components/personal-chat/personal-chat.component';
import { AuthGuard } from './shared/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TestPageComponent } from './components/test-page/test-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dash', component: DashboardComponent, canActivate: [AuthGuard]  },
  { path: 'dm/:id', component: PersonalChatComponent, canActivate: [AuthGuard] },
  { path: 'user/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'test', component: TestPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
