export function RecordScreen(
  {
    isRecording,
    startRecording,
    stopRecording
  }: {
    isRecording: boolean,
    startRecording: () => void,
    stopRecording: () => void
  }
) {
  return (
    <>
      <p>What do you want the joke to be <b>about</b>?</p>
      <div className='container__button'>
        <button
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Stop joke request' : 'Request joke'}
        </button>
      </div>
    </>
  )
}