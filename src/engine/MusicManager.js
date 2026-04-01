/**
 * Music & BPM synchronization
 */
export class MusicManager {
    constructor(bpm) {
        this.bpm = bpm;
        this.beatDuration = (60 / bpm) * 1000; // ms
        this.startTime = Date.now();
        this.currentBeat = 0;
    }

    update() {
        const elapsed = Date.now() - this.startTime;
        this.currentBeat = Math.floor(elapsed / this.beatDuration);
    }

    getBeatFactor() {
        // Returns a value between 0 and 1 representing the 'groove'
        const elapsed = Date.now() - this.startTime;
        const phase = (elapsed % this.beatDuration) / this.beatDuration;
        return Math.sin(phase * Math.PI); // Bounce with the beat
    }

    isOnBeat(tolerance = 100) {
        const elapsed = Date.now() - this.startTime;
        const offset = elapsed % this.beatDuration;
        return offset < tolerance || offset > (this.beatDuration - tolerance);
    }
}
