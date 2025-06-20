# Ask Matsya - AI Voice Assistant for Ethnic Products

A modern Next.js 14 application featuring real-time voice recognition, AI-powered conversations, and seamless integration with Speechmatics API for transcription services.

## 🌟 Features

- **Real-time Voice Recording**: MediaRecorder API with live audio visualization
- **AI Speech-to-Text**: Speechmatics API integration for accurate transcription
- **Conversation Management**: Persistent chat history with Supabase
- **Multi-language Support**: English and Tamil language support
- **Dark/Light Mode**: Responsive theme switching
- **Real-time Audio Visualization**: Waveform display during recording
- **TypeScript Support**: Fully typed codebase for better development experience

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Speech-to-Text**: Speechmatics API
- **Icons**: Lucide React
- **Audio Processing**: Web Audio API & MediaRecorder API

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Speechmatics API key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ask-matsya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Speechmatics API Configuration
   SPEECHMATICS_API_KEY=E3msX84Fjb5UbTdaLh46WlNa1Mv2qyWa
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase database:

   ```sql
   -- Conversations table
   CREATE TABLE conversations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID,
     title TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Messages table
   CREATE TABLE messages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
     type TEXT NOT NULL CHECK (type IN ('user', 'assistant')),
     content TEXT NOT NULL,
     audio_url TEXT,
     transcription_id UUID,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Transcriptions table
   CREATE TABLE transcriptions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     audio_file_id UUID,
     speechmatics_job_id TEXT,
     transcript_text TEXT NOT NULL,
     confidence_score FLOAT,
     language TEXT DEFAULT 'en',
     processing_status TEXT DEFAULT 'completed',
     metadata JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Audio files table
   CREATE TABLE audio_files (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID,
     file_path TEXT NOT NULL,
     file_size INTEGER,
     duration FLOAT,
     format TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Enable Row Level Security (Optional)**
   ```sql
   -- Enable RLS on tables
   ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

   -- Create policies for public access (adjust as needed)
   CREATE POLICY "Allow public access" ON conversations FOR ALL USING (true);
   CREATE POLICY "Allow public access" ON messages FOR ALL USING (true);
   CREATE POLICY "Allow public access" ON transcriptions FOR ALL USING (true);
   CREATE POLICY "Allow public access" ON audio_files FOR ALL USING (true);
   ```

## 🚀 Running the Application

1. **Development mode**
   ```bash
   npm run dev
   ```

2. **Production build**
   ```bash
   npm run build
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
ask-matsya/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── AudioRecorder.tsx   # Voice recording component
│   │   ├── ConversationView.tsx # Chat interface
│   │   └── VoiceVisualization.tsx # Audio visualization
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAudioRecorder.ts # Audio recording logic
│   │   ├── useSpeechToText.ts  # Speechmatics integration
│   │   └── useConversation.ts  # Chat state management
│   ├── lib/                    # Utility libraries
│   │   ├── supabase.ts         # Database client
│   │   ├── speechmatics.ts     # API integration
│   │   └── audio-utils.ts      # Audio processing
│   └── pages/api/              # API routes
│       ├── transcribe.ts       # Transcription endpoint
│       └── chat.ts             # Chat endpoint
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS config
└── package.json                # Dependencies
```

## 🔧 API Endpoints

### POST /api/transcribe
Transcribes audio using Speechmatics API.

**Request Body:**
```json
{
  "audioData": "base64_encoded_audio",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "transcript": "transcribed text",
  "confidence": 0.95,
  "jobId": "speechmatics_job_id"
}
```

### POST /api/chat
Generates AI response and saves to database.

**Request Body:**
```json
{
  "message": "user message",
  "conversationId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI response",
  "message": {message_object}
}
```

## 🎯 Key Features Explained

### Audio Recording
- Uses MediaRecorder API for high-quality audio capture
- Real-time audio level monitoring and visualization
- Support for WebM/Opus format optimized for speech recognition
- Pause/resume functionality during recording

### Speech Recognition
- Integration with Speechmatics API for accurate transcription
- Support for multiple languages (English, Tamil)
- Confidence scoring for transcription quality
- Automatic job polling for completion status

### Conversation Management
- Persistent storage of conversations and messages
- Real-time message display with typing indicators
- Audio message playback functionality
- Conversation history and search capabilities

### Voice Visualization
- Real-time waveform display during recording
- Audio level indicators
- Visual feedback for recording status
- Smooth animations and transitions

## 🎨 Customization

### Themes
The application supports dark and light themes. Toggle between themes using the theme switcher in the header.

### Languages
Currently supports English and Tamil. Add more languages by:
1. Updating the language selector
2. Adding language-specific prompts
3. Configuring Speechmatics language codes

### Styling
Built with Tailwind CSS for easy customization. Modify colors, spacing, and layouts in the component files.

## 🔍 Troubleshooting

### Common Issues

1. **Microphone Permission Denied**
   - Ensure HTTPS connection (required for microphone access)
   - Check browser permissions for microphone access
   - Try refreshing the page and allowing permissions

2. **Speechmatics API Errors**
   - Verify API key is correct in environment variables
   - Check API rate limits and usage
   - Ensure audio format is supported

3. **Supabase Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check database table schemas match the requirements
   - Ensure RLS policies allow the required operations

### Browser Compatibility
- Chrome: Full support
- Firefox: Full support
- Safari: Limited (some audio features may not work)
- Edge: Full support

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the Speechmatics API documentation
3. Check Supabase documentation for database issues

## 🎉 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.