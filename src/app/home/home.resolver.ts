import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICatalog } from '../icatalog';
import { Resolve } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class HomeResolver implements Resolve<ICatalog> {
  constructor(private http: HttpClient) { }
  resolve() { return this.http.get<ICatalog>('/assets/songs/catalog.json'); }
}
