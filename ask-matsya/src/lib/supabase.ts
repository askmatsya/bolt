import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Conversation {
  id: string;
  user_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  type: 'user' | 'assistant';
  content: string;
  audio_url?: string;
  transcription_id?: string;
  created_at: string;
}

export interface Transcription {
  id: string;
  audio_file_id?: string;
  speechmatics_job_id?: string;
  transcript_text: string;
  confidence_score: number;
  language: string;
  processing_status: string;
  metadata: any;
  created_at: string;
}

export interface AudioFile {
  id: string;
  user_id: string;
  file_path: string;
  file_size: number;
  duration: number;
  format: string;
  created_at: string;
}