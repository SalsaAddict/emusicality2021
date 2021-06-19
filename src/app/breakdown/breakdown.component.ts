import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IContext } from '../ibreakdown';
import { inRange, Measure, Section } from '../song/song';

export const beatMarkers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export interface INavigation { next?: number; previous?: number; }

@Component({ selector: 'app-breakdown', templateUrl: './breakdown.component.html', styleUrls: ['./breakdown.component.css'] })
export class BreakdownComponent implements OnInit, OnChanges {
  @Input() bpm!: number;
  @Input() beatsPerMeasure!: number;
  @Input() sections!: Section[];
  @Input() beats!: number;
  @Input('length') songLength!: number;
  @Output() navigation = new EventEmitter<INavigation>();
  ngOnChanges(changes: SimpleChanges) {
    let beats: number = changes.beats.currentValue, nav: INavigation = {};
    if (!inRange(beats, this.section)) {
      this.section = this.measure = this.markers = this.beat = undefined;
      for (let i = 0; i < this.sections.length; i++)
        if (inRange(beats, this.sections[i])) {
          this.section = this.sections[i];
          if (i > 0) nav.previous = this.sections[i - 1].startIndex;
          if (i + 1 < this.sections.length) nav.next = this.sections[i + 1].startIndex;
          this.navigation.emit(nav);
        }
    }
    if (this.section && !inRange(beats, this.measure)) {
      this.measure = this.markers = this.beat = undefined;
      for (let i = 0; i < this.section!.phrases.length; i++)
        for (let j = 0; j < this.section!.phrases[i].length; j++)
          if (inRange(beats, this.section!.phrases[i][j])) {
            this.measure = this.section!.phrases[i][j];
            this.markers = new Array(this.measure!.beats);
          }
    }
    if (inRange(beats, this.measure)) {
      this.beat = beats - this.measure!.startIndex + 1;
    }
  }
  public section?: Section;
  public measure?: Measure;
  public beat?: number;
  public markers?: void[];
  public progress(section: Section) {
    if (this.section !== section) return "100%";
    return (this.beats - section.startIndex + 1) / section.length * 100 + '%'
  }
  public context(prefix = 'text-') { return this.section ? prefix + this.section!.context : ''; }
  ngOnInit(): void { }
}
