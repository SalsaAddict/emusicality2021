export interface ICatalog {
    [name: string]: ISong;
}
export interface ISong {
    title: string;
    artist: string;
    genre: string;
}