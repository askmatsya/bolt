const SPEECHMATICS_API_KEY = process.env.SPEECHMATICS_API_KEY!;
const BASE_URL = 'https://asr.api.speechmatics.com/v2';

export interface TranscriptionJob {
  id: string;
  status: 'created' | 'running' | 'done' | 'failed';
  created_at: string;
  data_name?: string;
}

export interface TranscriptionResult {
  job: TranscriptionJob;
  results?: {
    transcripts: Array<{
      content: string;
      confidence: number;
    }>;
  };
}

export class SpeechmaticsService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = SPEECHMATICS_API_KEY;
    this.baseUrl = BASE_URL;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Speechmatics API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async createTranscriptionJob(audioBlob: Blob, language: string = 'en'): Promise<string> {
    const formData = new FormData();
    
    // Create configuration for the job
    const config = {
      type: 'transcription',
      transcription_config: {
        language: language,
        diarization: 'speaker',
        enable_partials: true,
      },
    };
    
    formData.append('config', JSON.stringify(config));
    formData.append('data_file', audioBlob, 'audio.webm');

    const result = await this.makeRequest('/jobs', {
      method: 'POST',
      body: formData,
    });

    return result.id;
  }

  async getJobStatus(jobId: string): Promise<TranscriptionJob> {
    return this.makeRequest(`/jobs/${jobId}`);
  }

  async getTranscriptionResult(jobId: string): Promise<TranscriptionResult> {
    return this.makeRequest(`/jobs/${jobId}/transcript`);
  }

  async pollForCompletion(jobId: string, maxAttempts: number = 30): Promise<TranscriptionResult> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.getJobStatus(jobId);
      
      if (status.status === 'done') {
        return this.getTranscriptionResult(jobId);
      }
      
      if (status.status === 'failed') {
        throw new Error('Transcription job failed');
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Transcription job timed out');
  }
}

export const speechmaticsService = new SpeechmaticsService();