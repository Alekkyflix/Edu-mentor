# EduMentor AI: Frontend Architecture

## Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + ShadcnUI
- **State Management:** Zustand (for client-side audio state)
- **Real-time:** Socket.io-client (or equivalent WebRTC wrapper)

## Core Components

### 1. `AudioProvider` (Context)
Manages microphone access and streams audio chunks to the backend (simulated for now via direct API calls).

### 2. `ChatInterface` (Component)
- **MessageList:** Renders text bubbles (User vs. System).
- **VoiceVisualizer:** Canvas-based waveform visualization reacting to `Sonic` agent voice output.

### 3. `TelemetryDashboard` (Component)
Visualizes `LearningState`:
- Frustration Level (Gauge chart)
- Struggle Score (Counter)
- Mastery (Progress Bar)

## API Integration
The frontend connects to `http://localhost:8000` (FastAPI).
- `POST /chat`: Sends text/transcript.
- `WS /audio-stream`: (Future) Bi-directional audio for Nova Sonic.
