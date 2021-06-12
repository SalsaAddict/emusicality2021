export interface IBreakdown {
    bpm: number;
    beatsPerMeasure: number;
    sections: ISection[];
}
export interface ISection {
    title: string;
    structure: string;
    measures: number | (string | number | true | IMeasure)[];
}
export interface IMeasure {
    structure?: string;
    beats?: number;
    split?: true;
}