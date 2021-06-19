export type IContext = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark';
export interface IContexts { [title: string]: IContext; }
export interface IBreakdown {
    beatsPerMeasure?: number;
    trimStart?: number;
    tracks: ITrackType;
    sections: ISection[];
    contexts?: IContexts;
}

export type ITrackType = (string | ITrack)[];
export interface ITrack {
    title: string;
    groups?: string | string[];
}
export interface ISection {
    title: string;
    structure?: string;
    phrases: IPhrases;
}
export type IPhrases = IPhrase[];
export type IPhrase = number | (string | number | IMeasure)[];
export interface IMeasure {
    structure?: string;
    beats?: number;
}