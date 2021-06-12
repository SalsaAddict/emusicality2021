export interface IBreakdown {
    bpm: number;
    beatsPerMeasure?: number;
    sections: ISection[];
}
export interface ISection {
    title: string;
    structure?: string;
    measures: IMeasureType;
}
export type IMeasureType = number | (string | number | true | IMeasure)[];
export interface IMeasure {
    structure?: string;
    beats?: number;
    split?: boolean;
}