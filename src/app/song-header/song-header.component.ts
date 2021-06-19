import { Component, Input, OnInit } from '@angular/core';
import { ISong } from '../icatalog';

@Component({  selector: 'app-song-header',  templateUrl: './song-header.component.html'})
export class SongHeaderComponent implements OnInit {
  @Input() songId!: string;
  @Input() song!: ISong;
  @Input() bpm?: number;
  @Input() beat?: number;
  public imageSrc(songId: string): string { return `/assets/songs/${songId}/cover.jpg`; }
  ngOnInit(): void { }
}
