import { useState, useRef } from 'react';
import './App.css';
import { getRecording, postRecording } from './services';

// const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
// const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


function App() {

  return (
    <>
      <AudioRecorder />
    </>
  );
}

function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        transcribeRecording(audioBlob);
      }

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
    catch (error) {
      console.error('Error accessing mic', error);
    }
  }

  const stopRecording = async() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
  }

  const transcribeRecording = async(audioBlob: Blob) => {
    try {
      const audioFile = new File([audioBlob], 'recording.weba', { type: 'audio/webm' });
      await postRecording(audioFile);
      const transcriptionRes = await getRecording();
      console.log(transcriptionRes);
    }
    catch (error) {
      console.error('Transcription error', error)
    }
  }

  return (
    <div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recordinge' : 'Start Recordinge'}
      </button>
    </div>
  );

}

export default App;
