import { useState } from "react";

function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// If speak feature is available, display joke in a button.
const speakable = ('speechSynthesis' in window);

export function JokeScreen(
  {
    dadJokes,
    goBack,
    termsFound
  }: { 
    dadJokes: string[],
    goBack: () => void,
    termsFound: boolean
  }
) {
  const [jokeIndex, setJokeIndex] = useState<number>(0);
  return (
    <>
      <div className='container__prev-next'>
        {jokeIndex > 0 &&
          (<button onClick={() => setJokeIndex(jokeIndex - 1)}>Previous</button>)
        }
        {jokeIndex < dadJokes.length - 1 && dadJokes.length > 1 &&
          (<button onClick={() => setJokeIndex(jokeIndex + 1)}>Next</button>)
        }
      </div>
      {!termsFound && (<h2>Not sure what the joke should be about, but here is a random one</h2>)}
      {
        speakable ?
        (<button title='Push here to hear the joke on a weird voice.' onClick={() => speak(dadJokes[jokeIndex])} className='container__joke'>{dadJokes[jokeIndex]}</button>) :
        (<h3 className='container__joke'>{dadJokes[jokeIndex]}</h3>)
      }
      <div className='container__back-button'>
        <button onClick={goBack}>Go Back</button>
      </div>
    </>
  )
}