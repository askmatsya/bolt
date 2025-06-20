export interface AudioConfig {
  sampleRate: number;
  channelCount: number;
  audioBitsPerSecond?: number;
}

export const OPTIMAL_CONFIG: AudioConfig = {
  sampleRate: 16000, // Optimal for Speechmatics
  channelCount: 1,   // Mono
  audioBitsPerSecond: 64000, // 64kbps
};

export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  async initializeAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }
  }

  async setupMediaStream(stream: MediaStream): Promise<void> {
    if (!this.audioContext || !this.analyser) {
      await this.initializeAudioContext();
    }

    const source = this.audioContext!.createMediaStreamSource(stream);
    source.connect(this.analyser!);
  }

  getAudioLevel(): number {
    if (!this.analyser || !this.dataArray) return 0;

    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    return sum / this.dataArray.length / 255; // Normalize to 0-1
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) return null;
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
      this.dataArray = null;
    }
  }
}

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const validateAudioFormat = (blob: Blob): boolean => {
  const supportedTypes = ['audio/webm', 'audio/mp4', 'audio/wav', 'audio/ogg'];
  return supportedTypes.includes(blob.type);
};

export const compressAudio = async (blob: Blob): Promise<Blob> => {
  // For now, return the original blob
  // In a production app, you might want to implement actual compression
  return blob;
};