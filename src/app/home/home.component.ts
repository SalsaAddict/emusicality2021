import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISongs } from '../icatalog';

@Component({ selector: 'app-home', templateUrl: './home.component.html' })
export class HomeComponent implements OnInit {
  constructor(route: ActivatedRoute) {
    this.songs = route.snapshot.data["songs"];
  }
  public readonly songs: ISongs;
  public href(songId: string): string { return `songs/${songId}`; }
  ngOnInit(): void { }
}
