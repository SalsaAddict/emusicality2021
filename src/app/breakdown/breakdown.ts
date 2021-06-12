import { IBreakdown, IMeasure, IMeasureType, ISection } from "../ibreakdown";
import { ISong } from "../icatalog";

export module Breakdown {
    export class Song implements ISong, IBreakdown {
        constructor(song: ISong, breakdown: IBreakdown) {
            this.title = song.title;
            this.artist = song.artist;
            this.genre = song.genre;
            this.bpm = breakdown.bpm;
            this.beatsPerMeasure = breakdown.beatsPerMeasure ?? 8;
            this.sections = [];
            let endIndex = 0, structure = '&mdash;';
            breakdown.sections.forEach((section: ISection, index: number) => {
                structure = section.structure ?? structure;
                let s = new Section(section.title, structure, section.measures, this.beatsPerMeasure);
                this.sections.push(s);
            });
            this.startIndex = 1;
            this.endIndex = endIndex;
        }
        public readonly title: string;
        public readonly artist: string;
        public readonly genre: string;
        public readonly bpm: number;
        public readonly beatsPerMeasure: number;
        public readonly sections: Section[];
        public readonly startIndex: number;
        public readonly endIndex: number;
    }
    export class Section implements ISection {
        constructor(
            public readonly title: string,
            public readonly structure: string,
            measures: IMeasureType,
            beatsPerMeasure: number) {
            if (typeof measures === 'number') {
                for (let i = 1; i <= measures; i++) {

                }
            }
        }
        public readonly measures: Measure[] = [];
    }
    export class Measure implements IMeasure {
        constructor(
            public readonly beats: number,
            public readonly structure: string,
            public readonly split: boolean = false,
            public readonly context: 'primary' | 'warning' | 'danger') {

        }
    }
}