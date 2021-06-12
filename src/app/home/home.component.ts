import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICatalog } from '../icatalog';


@Component({ selector: 'app-home', templateUrl: './home.component.html' })
export class HomeComponent implements OnInit {
  constructor(route: ActivatedRoute) {
    this.songs = route.snapshot.data["songs"];
  }
  public readonly songs: ICatalog;
  public href(songId: string): string { return `songs/${songId}`; }
  public imageSrc(songId: string): string { return `/assets/songs/${songId}/cover.jpg`; }
  ngOnInit(): void { }
}
