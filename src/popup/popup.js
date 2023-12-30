import { State } from '../state.js'
import {
  getTwitchUserByLogin,
} from '../api.js'
import { getUsersOnStreams } from '../utils.js'

function getDomElements () {
  const formElement = document.getElementById('form')
  const inputElement = document.getElementById('form-input')
  const buttonElement = document.getElementById('form-button')
  const ulElement = document.getElementById('ul')
  const liElements = document.querySelectorAll('.li')

  return {
    formElement,
    inputElement,
    buttonElement,
    ulElement,
    liElements
  }
}

function elementsOnLoad (status = true) {
  const {
    inputElement,
    buttonElement
  } = getDomElements()

  buttonElement.disabled = status
  inputElement.disabled = status
  buttonElement.textContent = status ? 'Loading...' : 'Add'
}

async function getUsers () {
  return await State.users
}

async function addUser (userLogin) {
  const actualUsers = (await getUsers()) ?? []

  State.users = [
    userLogin,
    ...actualUsers,
  ]
}

async function removeUser (userLogin) {
  const actualUsers = (await getUsers()) ?? []

  State.users = actualUsers.filter((u) => u !== userLogin)
}

function generateListListener () {
  const {
    liElements,
  } = getDomElements()

  liElements.forEach((e) => {
    e.addEventListener('click', async () => {
      await removeUser(e.textContent)
      generateList()
    })
  })
}

async function updateListStatus () {
  const {
    liElements,
  } = getDomElements()

  const userLoginsOnStream = (await getUsersOnStreams()).map(u => u.user_login)

  liElements.forEach((e) => {
    if (userLoginsOnStream.includes(e.textContent)) {
      e.style.color = '#10eb10'
    } else {
      e.style.color = '#da043c'
    }
  })
}

function sendMessage (message) {
  chrome.runtime.sendMessage(message)
}

function generateList () {
  getUsers()
    .then(async (users) => {
      const {
        liElements,
        ulElement,
      } = getDomElements()

      liElements.forEach((e) => e.remove())

      ;(users ?? []).forEach((u) => {
        const ulLiElement = document.createElement('li')
        ulLiElement.textContent = u
        ulLiElement.classList.add('li')
        ulLiElement.style.color = '#da043c'
        ulLiElement.style.fontWeight = 'bold'
        ulElement.appendChild(ulLiElement)
      })

      await updateListStatus()
      generateListListener()
    })
}

function printError (error) {
  const errorsElement = document.getElementById('errors')
  errorsElement.innerHTML = ''

  const errorElement = document.createElement('p')

  errorElement.textContent = error
  errorElement.style.color = 'red'
  errorsElement.appendChild(errorElement)

  setTimeout(() => {
    errorsElement.innerHTML = ''
  }, 3000)
}

function main () {
  generateList()

  const {
    formElement,
    inputElement
  } = getDomElements()

  formElement.addEventListener('submit', async (e) => {
    e.preventDefault()
    const value = inputElement.value
    const strippedValue = value.trim().toLowerCase()

    if (strippedValue.length <= 1) {
      inputElement.value = ''
      printError('Too short')
      elementsOnLoad(false)
      return
    }

    elementsOnLoad(true)

    const accessToken = await State.accessToken

    if (typeof accessToken !== 'string') {
      inputElement.value = ''
      printError('Not connected')
      return
    }

    getTwitchUserByLogin(strippedValue, accessToken)
      .then((userValid) => {
        elementsOnLoad(false)

        if (userValid === null) {
          const {
            inputElement
          } = getDomElements()

          inputElement.value = ''
          inputElement.focus()
          printError('User not found')
          return
        }

        addUser(strippedValue)
          .then(() => {
            const {
              inputElement
            } = getDomElements()

            inputElement.value = ''
            inputElement.focus()

            sendMessage({
              type: 'reset',
            })
            setTimeout(() => {
              generateList()
            }, 500)
          })
      })
  })
}

main()
