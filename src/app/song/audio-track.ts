import { Track } from "./song";
import { SongComponent, Speed, speeds, Volume, volumes } from "./song.component";

export class AudioTrack extends Track {
    constructor(private readonly song: SongComponent, track: Track) {
        super(song.songId, track.trackId, track.title, track.groups);
        this.mediaElement = document.createElement("audio");
        this.mediaElement.src = track.filename;
        this.masterGain = song.context.createGain();
        this.masterGain.connect(song.masterGain);
        this.slaveGain = song.context.createGain();
        this.slaveGain.connect(this.masterGain);
        this.audioSourceNode = song.context.createMediaElementSource(this.mediaElement);
        this.audioSourceNode.connect(this.slaveGain);
        this.setVolume('Normal');
        this.enable();
    }
    private readonly mediaElement: HTMLMediaElement;
    private readonly masterGain: GainNode;
    private readonly slaveGain: GainNode;
    private readonly audioSourceNode: MediaElementAudioSourceNode;
    private volume!: Volume;
    public async setVolume(volume: Volume) {
        await this.song.fade(this.slaveGain, volumes[volume], 0.5);
        this.volume = volume;
    }
    public volumeBtnClass(volume: Volume) { return this.volume === volume ? 'btn-secondary' : 'btn-outline-secondary'; }
    public seek(seconds: number) {
        return new Promise<void>((resolve) => {
            this.mediaElement.currentTime = seconds;
            if (this.mediaElement.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) resolve();
            else this.mediaElement.addEventListener('canplaythrough', (event) => { resolve(); });
        });
    }
    public get isEnded() { return this.mediaElement.ended; }
    public async play(onEnd: Function) {
        this.mediaElement.onended = function () { onEnd(); };
        await this.mediaElement.play();
    }
    public pause() { this.mediaElement.pause(); }
    public setSpeed(speed: Speed) { this.mediaElement.playbackRate = speeds[speed]; }
    public setRate(rate: number) { this.mediaElement.playbackRate = rate; }
    private disabled!: boolean;
    public get isDisabled() { return this.disabled; }
    public async disable() {
        if (this.disabled) return;
        this.disabled = true;
        await this.song.fade(this.masterGain, 0, 0.5);
    }
    public async enable() {
        if (!this.disabled) return;
        this.disabled = false;
        await this.song.fade(this.masterGain, 1, 0.5);
    }
    public async setGroup(group: string) {
        if (group === 'All' || this.groups.indexOf(group) >= 0)
            await this.enable();
        else
            await this.disable();
    }
}
