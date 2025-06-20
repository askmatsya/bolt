import { NextApiRequest, NextApiResponse } from 'next';
import { speechmaticsService } from '@/lib/speechmatics';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set larger limit for audio files
    },
  },
  maxDuration: 60, // Allow up to 60 seconds for transcription
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audioData, language = 'en' } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    // Convert base64 audio data to blob
    const audioBuffer = Buffer.from(audioData, 'base64');
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });

    // Create transcription job
    const jobId = await speechmaticsService.createTranscriptionJob(audioBlob, language);

    // Poll for completion
    const result = await speechmaticsService.pollForCompletion(jobId);

    if (result.results?.transcripts && result.results.transcripts.length > 0) {
      const transcript = result.results.transcripts[0];
      
      return res.status(200).json({
        success: true,
        transcript: transcript.content,
        confidence: transcript.confidence,
        jobId,
        metadata: {
          language,
          processingTime: new Date().toISOString(),
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'No transcription results received',
      });
    }
  } catch (error) {
    console.error('Transcription error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}