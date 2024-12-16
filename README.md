# Kevin Coscarelli Code Test
---
## How do I run this?

After cloning the repo, assuming you have Docker installed, you can run:
```
$ docker compose up --build -d
// and to stop the container after you're done:
$ docker compose down
```
If not, run:
```
$ npm install
$ npm run dev
```
and go to `localhost:3000`. I only tested it in Chrome :).

---

## Setup

- Started by configuring Docker for this app. Used AI to get some initial configuration using a node Docker image, specially for the `Dockerfile` and `compose.yaml`. Then did some fine tuning to be able to run the Vite development server inside the container and add the watch feature.
- Created a Vite project with a `react-ts` template, mainly because it's the last stack I had been using. Had to solve CORS issues by proxying requests in Vite's configuration.

## Development

I made up my mind about how I wanted the main quest to work step by step:
1. **Browser audio recording**: got a basic structure of how to use the `MediaRecorder` from AI since I had never used it.
2. **Audio transcription**: started by testing GoodTape API and the webhooks site. Realized GoodTape API doesn't support Chrome's  recording formats, so I had to include extra libraries to encode the recording into WAV format before sending it.
3. **Getting joke search terms from transcription**: after looking into the dad jokes API, decided to use the `/search` endpoint, so I had to figure out a way to get search terms from the transcription. Decided to add the prompt question "What do you want the joke to be **about**?" and hopefully the user would provide an answer that includes the word "**about**" so that I can use the words after as search terms.
4. **App UX**: Decided to split the app in two screens. The first one where the user records the audio and the second one after fetching the jokes where the jokes are displayed, and also can go back to make another request.

For the side quests:
- **Styling challenge**: The app itself has very little interaction, so I didn't feel there was much room for theming. Regardless, I tried to make it colourful with a highly readable font. Used a contrasting palette that makes interactive elements jump out. Kept the design responsive, although there wasn't much to change there with such a simple layout. Considered the use of Tailwind or a component library but it felt like overkill with the UI being so simple, so I stuck with good old CSS.
- **Joke voice output**: got a simple example with AI using native `SpeechSynthesisUtterance` API. If the browser supports the API, the joke is displayed in a button with an explanatory tooltip, and it plays the speech upon click. In the opposite case, the joke is displayed in plain text. Other alternatives for text-to speech feature are using cloud service providers, they all have some sort of service. Personally I used the Amazon one in a work project before, it worked quite well and was highly customizable.
- **Custom features**: Decided to add an elegant error handling in case finding search terms in the transcription was not possible. In that case a random joke is fetched instead. Also, the use of Docker in the project is an extra feature I like to add to projects for the sake of making them more accessible from any platform.


Enjoy!