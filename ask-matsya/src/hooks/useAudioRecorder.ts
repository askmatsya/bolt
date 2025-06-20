'use client';

import { useState, useRef, useCallback } from 'react';
import { AudioProcessor, OPTIMAL_CONFIG, validateAudioFormat } from '@/lib/audio-utils';

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
  error: string | null;
}

export interface UseAudioRecorderReturn {
  state: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  clearError: () => void;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const levelIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const updateAudioLevel = useCallback(() => {
    if (audioProcessorRef.current) {
      const level = audioProcessorRef.current.getAudioLevel();
      setState(prev => ({ ...prev, audioLevel: level }));
    }
  }, []);

  const updateDuration = useCallback(() => {
    if (startTimeRef.current > 0) {
      const duration = (Date.now() - startTimeRef.current) / 1000;
      setState(prev => ({ ...prev, duration }));
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      clearError();

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: OPTIMAL_CONFIG.sampleRate,
          channelCount: OPTIMAL_CONFIG.channelCount,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Set up audio processing for visualization
      audioProcessorRef.current = new AudioProcessor();
      await audioProcessorRef.current.initializeAudioContext();
      await audioProcessorRef.current.setupMediaStream(stream);

      // Configure MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: OPTIMAL_CONFIG.audioBitsPerSecond,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        setState(prev => ({
          ...prev,
          error: 'Recording error occurred',
          isRecording: false,
        }));
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      startTimeRef.current = Date.now();

      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
        error: null,
      }));

      // Start intervals for duration and audio level updates
      durationIntervalRef.current = setInterval(updateDuration, 100);
      levelIntervalRef.current = setInterval(updateAudioLevel, 50);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      setState(prev => ({
        ...prev,
        error: errorMessage.includes('Permission denied') 
          ? 'Microphone permission denied. Please allow access and try again.'
          : errorMessage,
        isRecording: false,
      }));
    }
  }, [clearError, updateDuration, updateAudioLevel]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || state.isRecording === false) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (!validateAudioFormat(blob)) {
          setState(prev => ({
            ...prev,
            error: 'Invalid audio format recorded',
          }));
          resolve(null);
          return;
        }

        resolve(blob);
      };

      mediaRecorderRef.current.stop();

      // Clean up
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (audioProcessorRef.current) {
        audioProcessorRef.current.dispose();
        audioProcessorRef.current = null;
      }

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      if (levelIntervalRef.current) {
        clearInterval(levelIntervalRef.current);
        levelIntervalRef.current = null;
      }

      setState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        audioLevel: 0,
      }));

      startTimeRef.current = 0;
    });
  }, [state.isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));
    }
  }, [state.isRecording, state.isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume();
      setState(prev => ({ ...prev, isPaused: false }));
    }
  }, [state.isRecording, state.isPaused]);

  return {
    state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearError,
  };
};