import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeResolver } from './home/home.resolver';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, resolve: { songs: HomeResolver } },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
