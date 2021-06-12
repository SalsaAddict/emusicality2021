import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogService } from './catalog.service';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, resolve: { songs: CatalogService } },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
