import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISongs } from '../icatalog';
import { Resolve } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class HomeResolver implements Resolve<ISongs> {
  constructor(private http: HttpClient) { }
  resolve() { return this.http.get<ISongs>('/assets/songs/catalog.json'); }
}
