'use client';

// Premium Sound Manager - Web Audio API based
// Ultra-subtle sounds that enhance, never annoy

class SoundManagerClass {
  private context: AudioContext | null = null;
  private muted: boolean = false;
  private initialized: boolean = false;
  
  // Volume levels (VERY subtle)
  private readonly CLICK_VOLUME = 0.03;  // 3%
  private readonly HOVER_VOLUME = 0.015; // 1.5%
  private readonly WHOOSH_VOLUME = 0.04; // 4%
  
  private initContext() {
    if (typeof window === 'undefined') return false;
    
    if (!this.initialized) {
      try {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.muted = localStorage.getItem('socialeSoundsMuted') === 'true';
        this.initialized = true;
      } catch (e) {
        console.warn('Web Audio API not supported');
        return false;
      }
    }
    return true;
  }
  
  private ensureContext() {
    if (!this.initContext()) return null;
    
    // Resume context if suspended (browser autoplay policy)
    if (this.context?.state === 'suspended') {
      this.context.resume();
    }
    return this.context;
  }
  
  // Soft, professional click - like high-end mechanical keyboard
  playClick() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      // Soft sine wave, slightly pitched up
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);
      
      // Quick attack, fast decay
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.CLICK_VOLUME, ctx.currentTime + 0.002);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      
      // Low-pass filter for warmth
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.07);
    } catch (e) {
      // Silently fail - sounds are enhancement, not critical
    }
  }
  
  // Gentle whoosh for transitions
  playWhoosh() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    
    try {
      // Create noise with filtered sweep
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Pink noise generation
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      // Bandpass filter for airy sound
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.08);
      filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
      filter.Q.value = 2;
      
      // Gentle envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.WHOOSH_VOLUME, ctx.currentTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      source.start(ctx.currentTime);
    } catch (e) {
      // Silently fail
    }
  }
  
  // Ultra-subtle hover sound
  playHover() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 1200;
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.HOVER_VOLUME, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Silently fail
    }
  }
  
  // Success chime - for form submissions
  playSuccess() {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    
    try {
      const playNote = (freq: number, delay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };
      
      // Pleasant major triad arpeggio
      playNote(523.25, 0, 0.15);      // C5
      playNote(659.25, 0.08, 0.15);   // E5
      playNote(783.99, 0.16, 0.2);    // G5
    } catch (e) {
      // Silently fail
    }
  }
  
  toggleMute(): boolean {
    this.initContext();
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('socialeSoundsMuted', String(this.muted));
    }
    return this.muted;
  }
  
  isMuted(): boolean {
    if (typeof window !== 'undefined' && !this.initialized) {
      this.muted = localStorage.getItem('socialeSoundsMuted') === 'true';
    }
    return this.muted;
  }
}

// Singleton instance
export const SoundManager = new SoundManagerClass();
