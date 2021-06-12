import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICatalog } from './icatalog';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CatalogService implements Resolve<ICatalog> {
  constructor(private http: HttpClient) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.http.get<ICatalog>('/assets/songs/catalog.json');
  }
}
