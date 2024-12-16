import { useState, useRef } from 'react';
import { getJokes, getTranscription, postRecording } from './services';
import {MediaRecorder, register, IMediaRecorder} from 'extendable-media-recorder';
import {connect} from 'extendable-media-recorder-wav-encoder';
import './AudioRecorder.css';
import { RecordScreen } from './RecordScreen';
import { JokeScreen } from './JokeScreen';

enum ScreenStateEnum {
  Record,
  JokesReady
}

await register(await connect());

// Going for .wav MIMEtype because .webm or .weba are not supported by the API
const mimeType = 'audio/wav';

/**
 * Because the request prompt is "What do you want the joke to be about?"
 * I expect and cross my fingers so that users include the word "about"
 * in the joke request. I search the keyword in the transcription and get
 * the substring after it, format it and use it as a query parameter value
 */
const getJokeSearchTerms = (str?: string) => {
  try {
    if (!str || str === '') {
      throw new Error('Transcription is empty');
    }
    const keyword = 'about'
    const index = str.indexOf(keyword);

    if (index === -1) {
      throw new Error("Couldn't identify any search term");
    }

    const afterWord = str.substring(index + keyword.length).trim();
    return encodeURIComponent(afterWord);
  }
  catch(error: any) {
    console.error(error.message);
  }
}

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<IMediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [dadJokes, setDadJokes] = useState<string[]>([]);
  const [screenState, setScreenState] = useState<ScreenStateEnum>(ScreenStateEnum.Record)
  const [termsFound, setTermsFound] = useState(true)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        transcribeAndQueryJoke(audioBlob);
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

  const transcribeAndQueryJoke = async(audioBlob: Blob) => {
    try {
      const audioFile = new File([audioBlob], 'recording.wav', { type: mimeType });

      await postRecording(audioFile);
      
      fetchTranscription()
    }
    catch (error) {
      console.error('Transcription error', error)
    }
  }

  const fetchTranscription = () => {
    // Small timeout to let webhook endpoint catch up
    setTimeout(async () => {
      try {
        const transcriptionRes = await getTranscription();
        const resultText: string = transcriptionRes.data.content.text
        const formattedSearchParams = getJokeSearchTerms(resultText);
        setTermsFound(formattedSearchParams ? true : false);
        const jokesRaw = (await getJokes(formattedSearchParams)).data;
        setDadJokes(jokesRaw.split('\n'));
        setScreenState(ScreenStateEnum.JokesReady);
      }
      catch (error) {
        console.error('Error fetching transcription from webhook endpoint', error);
      }

    }, 1000);
  }

  return (
    <div className='container'>
      <h1>Get your dad joke today!</h1>
      {
        screenState === ScreenStateEnum.Record ?
        (<RecordScreen
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />) :
        (<JokeScreen
          dadJokes={dadJokes}
          goBack={() => setScreenState(ScreenStateEnum.Record)}
          termsFound={termsFound}
        />)
      }
    </div>
  );
}
