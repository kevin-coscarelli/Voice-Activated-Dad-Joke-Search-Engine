import axios from 'axios';

const getRecordingData = {
  url: 'https://webhook.site/token/5010786f-397d-472b-aa41-af51e6fe51f9/request/latest/raw',
  apikey: '5010786f-397d-472b-aa41-af51e6fe51f9'
}

export const getRecording = () => {
  const headers = {
      'Accept': 'application/json',
      'api-key': getRecordingData.apikey,
  }
  return axios.get(
    getRecordingData.url, {
      headers: { ...headers },
      withCredentials: true
    }
  );
}

const postRecordingData = {
  url: 'https://api.goodtape.io/transcribe',
  apikey: 'goodluckhopeyouhavefun',
  callbackUrl: 'https://webhook.site/5010786f-397d-472b-aa41-af51e6fe51f9'
}

export const postRecording = (audio: File) => {
  const headers = {
    'Authorization': postRecordingData.apikey,
  }

  const formData = new FormData();
  formData.append('audio', audio);
  formData.append('languageCode', 'en');
  formData.append('callbackUrl', postRecordingData.callbackUrl);

  return axios.post(
    '/api/transcribe',
    formData,
    {
      headers: {
        ...headers,
      }
    }
  );
}