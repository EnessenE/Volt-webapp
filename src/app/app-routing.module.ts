import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalChatComponent } from './components/personal-chat/personal-chat.component';

const routes: Routes = [
  { path: '', component: PersonalChatComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
