import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegisterComponent } from './landing-page/register/register.component';
import { LoginComponent } from './landing-page/login/login.component';

const routes: Routes = [
  { path:'', component:LandingPageComponent},
  { path: 'register', component:RegisterComponent},
  { path: 'login', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
