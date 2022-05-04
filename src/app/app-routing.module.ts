import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './components/pages/config/config.component';
import { LoginComponent } from './components/pages/login/login.component';
import { MainComponent } from './components/pages/main/main.component';

const routes: Routes = [
  {path:"main", component: MainComponent},
  {path:"configuration", component: ConfigComponent},
  {path:"configuration/:item", component: ConfigComponent},
  {path:"login", component: LoginComponent},
  {path:"", redirectTo:"main", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
