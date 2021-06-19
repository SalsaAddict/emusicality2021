import { IBreakdown, IMeasure, IPhrases, IPhrase, ISection, ITrack, IContext } from '../ibreakdown';
import { ISong } from '../icatalog';

export interface IRange { startIndex: number; endIndex: number; length: number; }
export function inRange(index: number, range?: IRange) {
    if (!range) return false;
    if (index >= range.startIndex && index <= range.endIndex) return true;
    return false;
}

export class Song implements ISong, IBreakdown, IRange {
    constructor(public readonly songId: string, iSong: ISong, iBreakdown: IBreakdown) {
        this.title = iSong.title;
        this.artist = iSong.artist;
        this.genre = iSong.genre;
        this.bpm = iSong.bpm;
        this.trimStart = iBreakdown.trimStart ?? 0;

        //#region Tracks
        this.groups = ['All'];
        this.tracks = [];
        iBreakdown.tracks.forEach((track, trackId) => {
            if (typeof track === 'string') this.tracks.push(new Track(songId, trackId, track));
            else {
                let t = new Track(songId, trackId, track.title, track.groups);
                t.groups.forEach((group) => { if (this.groups.indexOf(group) < 0) this.groups.push(group) });
                this.tracks.push(t);
            }
        });
        //#endregion

        //#region Sections
        let index = 1;
        this.sections = [];
        let structure = '&mdash;';
        iBreakdown.sections.forEach((section, sectionId) => {
            structure = section.structure ?? structure;
            let context: IContext = 'info';
            if (iBreakdown.contexts && iBreakdown.contexts![section.title]) context = iBreakdown.contexts![section.title];
            let s = new Section(index, sectionId, section.title, structure, context ?? 'info', section.phrases, iBreakdown.beatsPerMeasure ?? 8);
            index = s.endIndex + 1;
            this.sections.push(s);
        });
        //#endregion

        this.startIndex = 1;
        this.endIndex = index - 1;
        this.length = this.endIndex - this.startIndex + 1;
    }
    public readonly title: string;
    public readonly artist: string;
    public readonly genre: string;
    public readonly bpm: number;
    public readonly trimStart: number;
    public readonly groups: string[];
    public readonly tracks: Track[];
    public readonly sections: Section[];
    public readonly startIndex: number;
    public readonly endIndex: number;
    public readonly length: number;
}
export class Track implements ITrack {
    constructor(songId: string, public readonly trackId: number, public readonly title: string, groups?: string | string[]) {
        this.filename = `/assets/songs/${songId}/track${trackId}.trk`;
        this.groups = groups ? Array.isArray(groups) ? groups : [groups] : [];
    }
    public readonly filename: string;
    public readonly groups: string[];
}
export class Section implements ISection, IRange {
    constructor(
        startIndex: number,
        public readonly sectionId: number,
        public readonly title: string,
        public readonly structure: string,
        public readonly context: IContext,
        iPhrases: IPhrases,
        beatsPerMeasure: number) {
        let index = startIndex;
        this.phrases = [];
        if ((function (iPhrases: IPhrases): iPhrases is IPhrase[] {
            if (!Array.isArray(iPhrases)) iPhrases = [iPhrases];
            return true
        })(iPhrases)) {
            iPhrases.forEach((iPhrase) => {
                let phrase: Measure[] = [];
                if (typeof iPhrase === 'number') {
                    for (let i = 0; i < iPhrase; i++) {
                        let m = new Measure(structure, beatsPerMeasure, false, index);
                        index = m.endIndex + 1;
                        phrase.push(m);
                    }
                }
                else iPhrase.forEach((measure) => {
                    let beats: number, warning: boolean;
                    if (typeof measure === 'number') {
                        beats = measure;
                    }
                    else if (typeof measure === 'string') {
                        structure = measure ?? structure;
                        beats = beatsPerMeasure;
                    }
                    else {
                        structure = measure.structure ?? "&mdash;";
                        beats = measure.beats ?? beatsPerMeasure
                    }
                    warning = beats !== beatsPerMeasure;
                    let m = new Measure(structure, beats, warning, index);
                    index = m.endIndex + 1;
                    phrase.push(m);
                });
                this.phrases.push(phrase);
            });
        }
        this.startIndex = startIndex;
        this.endIndex = index - 1;
        this.length = this.endIndex - this.startIndex + 1;
    }
    public readonly phrases: Measure[][];
    public readonly startIndex: number;
    public readonly endIndex: number;
    public readonly length: number;
}
export class Measure implements IMeasure, IRange {
    constructor(
        public readonly structure: string,
        public readonly beats: number,
        public readonly warning: boolean,
        public readonly startIndex: number) {
        this.endIndex = this.startIndex + beats - 1;
        this.length = this.endIndex - this.startIndex + 1;
    }
    public readonly endIndex: number;
    public readonly length: number;
}