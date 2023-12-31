import { State } from '../state.js'
import {
  clearStorage,
  removeAllNotifications
} from '../utils.js'

function saveSettings (settings = {}) {
  State.settings = settings
}

async function getSettings () {
  return await State.settings ?? {}
}

async function applySettings () {
  const settings = await getSettings()

  const inputAudioElement = document.getElementById('form-audio')
  inputAudioElement.checked = settings.audio ?? false
}

async function main () {
  await applySettings()

  const buttonResetElement = document.getElementById('button-reset-all')
  buttonResetElement.addEventListener('click', async () => {
    clearStorage()
    chrome.runtime.sendMessage({ type: 'reset-init' })
    setTimeout(async () => {
      await applySettings()
    }, 500)
    removeAllNotifications()
  })

  const formElement = document.getElementById('form')
  formElement.addEventListener('submit', async (e) => {
    e.preventDefault()

    const inputAudioElement = document.getElementById('form-audio')

    saveSettings({
      audio: inputAudioElement.checked ?? false
    })
  })
}

void main()
