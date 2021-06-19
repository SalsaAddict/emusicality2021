import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ISongs } from '../icatalog';
import { IBreakdown } from '../ibreakdown';
import { Song } from './song';

@Injectable({ providedIn: 'root' })
export class SongResolver implements Resolve<Song> {
  constructor(private http: HttpClient) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Song> {
    return new Observable<Song>((observer) => {
      let path = '/assets/songs/', songId: string = route.params["songId"];
      this.http.get<ISongs>(`${path}catalog.json`)
        .subscribe(songs => {
          path += `${songId}/`;
          this.http.get<IBreakdown>(`${path}breakdown.json`)
            .subscribe(breakdown => {
              console.log("SongResolver", songId, songs[songId], breakdown);
              observer.next(new Song(songId, songs[songId], breakdown));
              observer.complete();
            });
        });
    });
  }
}
