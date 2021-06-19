import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INavigation } from '../breakdown/breakdown.component';
import { AudioTrack } from './audio-track';
import { Song } from './song';

export const fadeIn = 0.1, fadeOut = 0.25;

export type Speed = 'Slow' | 'Normal' | 'Fast';
export type Speeds = { [speed in Speed]: number; }
export const speeds: Speeds = { 'Slow': 0.9, 'Normal': 1, 'Fast': 1.1 };

export type Volume = 'Off' | 'Normal' | 'High';
export type Volumes = { [volume in Volume]: number; }
export const volumes: Volumes = { 'Off': 0, 'Normal': 0.8, 'High': 1.25 };

@Component({ selector: 'app-song', templateUrl: './song.component.html', styleUrls: ['./song.component.css'] })
export class SongComponent implements OnInit {

  constructor(route: ActivatedRoute) {
    this.song = route.snapshot.data['song'];
    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    for (let i = 0; i < this.song.tracks.length; i++)
      this.song.tracks[i] = new AudioTrack(this, this.song.tracks[i]);
    this.group = this.groups[0];
  }

  //#region Header
  private readonly song: Song;
  public get songId() { return this.song.songId; }
  public get title() { return this.song.title; }
  public get artist() { return this.song.artist; }
  public get genre() { return this.song.genre; }
  public get tracks() { return this.song.tracks as AudioTrack[]; }
  public get sections() { return this.song.sections; }
  //#endregion

  //#region AudioContext
  public readonly context: AudioContext;
  public readonly masterGain: GainNode;
  private resumeContext() { return this.context.state === 'running' ? Promise.resolve() : this.context.resume(); }
  private suspendContext() { return this.context.state === 'suspended' ? Promise.resolve() : this.context.suspend(); }
  //#endregion

  //#region Speed
  private rate: number = 1.0;
  private setRate() { this.tracks.forEach(track => track.setRate(this.rate)); }
  public get speed() {
    let value = Math.round((this.rate - 1) * 100), sign: string;
    switch (Math.sign(value)) {
      case 1: sign = "&plus;"; break;
      case -1: sign = "&minus;"; break;
      default: sign = "&plusmn;"; break;
    }
    return sign + Math.abs(value).toString() + '%';
  }
  public slower() { this.rate -= 0.01; this.setRate(); }
  public normal() { this.rate = 1; this.setRate(); }
  public faster() { this.rate += 0.01; this.setRate(); }
  //#endregion

  //#region Clock
  public get bpm() { return this.song.bpm * this.rate; }
  private get secondsPerBeat() { return 60 / this.song.bpm; }
  private elapsed: number = 0;
  public get seconds() { return this.elapsed; }
  public get beats() {
    if (this.elapsed < this.song.trimStart) return 0;
    return Math.floor((this.elapsed - this.song.trimStart) / this.secondsPerBeat) + 1;
  }
  public get length() { return this.song.length; }
  private handle?: number;
  private startClock(currentTime = this.context.currentTime) {
    this.handle = requestAnimationFrame(() => {
      this.elapsed -= (currentTime - (currentTime = this.context.currentTime)) * this.rate;
      this.startClock(currentTime);
    });
  }
  private stopClock() { cancelAnimationFrame(this.handle!); }
  //#endregion

  //#region Faders
  private fadeIn(seconds = fadeIn) { return this.fade(this.masterGain, 1, this.elapsed < this.song.trimStart + fadeIn ? 0 : seconds); }
  private fadeOut(seconds = fadeOut) { return this.fade(this.masterGain, 0, seconds); }
  public fade(node: GainNode, value: number, seconds: number) {
    if (this.playing && seconds > 0) {
      let wasBusy = this.busy;
      if (!wasBusy) this.busy = true;
      return new Promise<void>((resolve) => {
        node.gain.linearRampToValueAtTime(value, this.context.currentTime + seconds);
        setTimeout(() => {
          resolve();
          if (!wasBusy) this.busy = false;
        }, seconds * 1000)
      });
    } else {
      node.gain.value = value;
      return Promise.resolve();
    }
  }
  //#endregion

  //#region  Navigation
  navigation(nav: INavigation) {
    this.previous = nav.previous ?? 0;
    this.next = nav.next ?? 1;
  }
  private previous: number = 0;
  private next: number = 1;
  //#endregion

  //#region Transport
  private busy = false;
  public get isBusy() { return this.busy; }
  private playing = false;
  public get isPlaying() { return this.playing; }
  public async play() {
    this.busy = true;
    this.masterGain.gain.value = 0;
    await this.resumeContext();
    let promises: Promise<void>[] = [];
    this.tracks.forEach(track => promises.push(track.seek(this.elapsed)));
    await Promise.all(promises);
    this.tracks.forEach(track => promises.push(track.play(this.onEnd)));
    await Promise.all(promises)
    this.startClock();
    await this.fadeIn();
    this.playing = true;
    this.busy = false;
  }
  private onEnd = () => {
    let allEnded = true;
    this.tracks.forEach((track) => { if (!track.isEnded) allEnded = false; });
    console.log("onEnd", allEnded);
    if (allEnded) {
      this.pause();
      this.goToBeat(0);
    }
  }
  public async pause() {
    this.busy = true;
    await this.fadeOut();
    this.tracks.forEach(track => track.pause());
    await this.suspendContext();
    this.stopClock();
    this.playing = false;
    this.busy = false;
  }
  public async goToBeat(index: number) {
    this.busy = true;
    let wasPlaying = this.playing;
    if (wasPlaying) {
      await this.fadeOut(0.1);
      this.tracks.forEach(track => track.pause());
      this.stopClock();
    }
    this.elapsed = ((index - 1) * this.secondsPerBeat) + this.song.trimStart;
    if (wasPlaying) {
      let promises: Promise<void>[] = [];
      this.tracks.forEach(track => promises.push(track.seek(this.elapsed)));
      await Promise.all(promises);
      this.tracks.forEach(track => promises.push(track.play(this.onEnd)));
      await Promise.all(promises)
      this.startClock();
      await this.fadeIn(0.1);
    }
    this.busy = false;
  }
  public async goToFirst() { await this.goToBeat(0); }
  public async goToPrevious() { await this.goToBeat(this.previous); }
  public async goToNext() { await this.goToBeat(this.next); }
  //#endregion

  //#region Groups
  public get groups() { return this.song.groups; }
  public group: string;
  public async setGroup(group: string) {
    this.busy = true;
    let promises: Promise<void>[] = [];
    this.tracks.forEach(track => promises.push(track.setGroup(group)));
    await Promise.all(promises);
    this.busy = false;
  }
  //#endregion

  ngOnInit(): void { }
}
