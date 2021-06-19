export interface ISongs {
    [name: string]: ISong;
}
export interface ISong {
    title: string;
    artist: string;
    genre: string;
    bpm: number;
}