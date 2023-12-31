async function handleMessages ({ type }) {
  switch (type) {
    case 'play-audio':
      await handlePlaySound()
      break
    default:
      break
  }
}

async function handlePlaySound () {
  const audio = new Audio('assets/notification.mp3')
  audio.loop = false
  audio.volume = 1
  await audio.play()
}

chrome.runtime.onMessage.addListener(handleMessages)
