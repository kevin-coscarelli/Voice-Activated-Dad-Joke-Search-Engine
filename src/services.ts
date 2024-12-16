import axios from 'axios';

axios.interceptors.request.use((config) => {
  if (config.fetchOptions?.onlyText) {
    config.headers['Accept'] = 'text/plain';  // Explicitly set Accept header
  }
  return config;
});

const getTranscriptionData = {
  url: '/callback/token/5010786f-397d-472b-aa41-af51e6fe51f9/request/latest/raw',
  apikey: '5010786f-397d-472b-aa41-af51e6fe51f9'
}

export const getTranscription = () => {
  const headers = {
      'Accept': 'application/json',
      'api-key': getTranscriptionData.apikey,
  }
  return axios.get(
    getTranscriptionData.url, {
      headers: { ...headers },
      withCredentials: true
    }
  );
}

const postRecordingData = {
  url: '/api/transcribe',
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
    postRecordingData.url,
    formData,
    {
      headers: {
        ...headers,
      }
    }
  );
}

export const getJokes = (searchTerms?: string) => {
  // If no search terms were identified, get a random one.

  const headers = {
    'Accept': 'text/plain',
  };
  if (searchTerms) {
    return axios.get(
      '/dadjokes/search',
      {
        ...headers,
        params: {
          'term': searchTerms
        },
        fetchOptions: {
          onlyText: true
        }
      }
    );
  }

  return axios.get(
    '/dadjokes',
    {
      ...headers,
      fetchOptions: {
        onlyText: true
      }
    }
  )
}