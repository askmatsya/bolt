'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Square, Play, Pause, Upload, AlertCircle } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { VoiceVisualization } from './VoiceVisualization';
import { formatDuration } from '@/lib/audio-utils';

interface AudioRecorderProps {
  onTranscriptionComplete?: (transcript: string, audioBlob: Blob) => void;
  language?: string;
  className?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptionComplete,
  language = 'en',
  className = '',
}) => {
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const {
    state: recordingState,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearError: clearRecordingError,
  } = useAudioRecorder();

  const {
    state: transcriptionState,
    transcribeAudio,
    clearTranscription,
    clearError: clearTranscriptionError,
  } = useSpeechToText();

  const handleStartRecording = async () => {
    setRecordedBlob(null);
    clearTranscription();
    await startRecording();
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      setRecordedBlob(blob);
    }
  };

  const handlePlayback = () => {
    if (!recordedBlob) return;

    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(URL.createObjectURL(recordedBlob));
    audio.play();
    setIsPlaying(true);
    setAudioElement(audio);

    audio.onended = () => {
      setIsPlaying(false);
      setAudioElement(null);
    };
  };

  const handleTranscribe = async () => {
    if (!recordedBlob) return;

    await transcribeAudio(recordedBlob, language);
    
    if (transcriptionState.transcript && onTranscriptionComplete) {
      onTranscriptionComplete(transcriptionState.transcript, recordedBlob);
    }
  };

  const error = recordingState.error || transcriptionState.error;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Voice Recorder
        </h3>
        {recordingState.duration > 0 && (
          <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
            {formatDuration(recordingState.duration)}
          </span>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
          <button
            onClick={() => {
              clearRecordingError();
              clearTranscriptionError();
            }}
            className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Voice Visualization */}
      {recordingState.isRecording && (
        <div className="mb-4">
          <VoiceVisualization 
            audioLevel={recordingState.audioLevel}
            isActive={recordingState.isRecording && !recordingState.isPaused}
          />
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        {!recordingState.isRecording ? (
          <button
            onClick={handleStartRecording}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-colors duration-200 shadow-lg hover:shadow-xl"
            title="Start Recording"
          >
            <Mic className="w-6 h-6" />
          </button>
        ) : (
          <>
            <button
              onClick={recordingState.isPaused ? resumeRecording : pauseRecording}
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-3 transition-colors duration-200"
              title={recordingState.isPaused ? "Resume" : "Pause"}
            >
              {recordingState.isPaused ? (
                <Play className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={handleStopRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-3 transition-colors duration-200"
              title="Stop Recording"
            >
              <Square className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Recording Status */}
      {recordingState.isRecording && (
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {recordingState.isPaused ? 'Recording Paused' : 'Recording...'}
            </span>
          </div>
        </div>
      )}

      {/* Playback and Transcription Controls */}
      {recordedBlob && !recordingState.isRecording && (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePlayback}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={handleTranscribe}
              disabled={transcriptionState.isTranscribing}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Upload className="w-4 h-4" />
              <span>
                {transcriptionState.isTranscribing ? 'Transcribing...' : 'Transcribe'}
              </span>
            </button>
          </div>

          {/* Transcription Result */}
          {transcriptionState.transcript && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Transcription
                {transcriptionState.confidence > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Confidence: {Math.round(transcriptionState.confidence * 100)}%)
                  </span>
                )}
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {transcriptionState.transcript}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loading States */}
      {transcriptionState.isTranscribing && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Transcribing audio...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};