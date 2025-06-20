'use client';

import { useState, useCallback } from 'react';
import { speechmaticsService } from '@/lib/speechmatics';

export interface TranscriptionState {
  isTranscribing: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  jobId: string | null;
}

export interface UseSpeechToTextReturn {
  state: TranscriptionState;
  transcribeAudio: (audioBlob: Blob, language?: string) => Promise<void>;
  clearTranscription: () => void;
  clearError: () => void;
}

export const useSpeechToText = (): UseSpeechToTextReturn => {
  const [state, setState] = useState<TranscriptionState>({
    isTranscribing: false,
    transcript: '',
    confidence: 0,
    error: null,
    jobId: null,
  });

  const clearTranscription = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      confidence: 0,
      error: null,
      jobId: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob, language: string = 'en') => {
    try {
      setState(prev => ({
        ...prev,
        isTranscribing: true,
        error: null,
        transcript: '',
        confidence: 0,
      }));

      // Create transcription job
      const jobId = await speechmaticsService.createTranscriptionJob(audioBlob, language);
      
      setState(prev => ({ ...prev, jobId }));

      // Poll for completion
      const result = await speechmaticsService.pollForCompletion(jobId);

      if (result.results?.transcripts && result.results.transcripts.length > 0) {
        const transcript = result.results.transcripts[0];
        setState(prev => ({
          ...prev,
          isTranscribing: false,
          transcript: transcript.content,
          confidence: transcript.confidence,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isTranscribing: false,
          error: 'No transcription results received',
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
      setState(prev => ({
        ...prev,
        isTranscribing: false,
        error: errorMessage,
      }));
    }
  }, []);

  return {
    state,
    transcribeAudio,
    clearTranscription,
    clearError,
  };
};