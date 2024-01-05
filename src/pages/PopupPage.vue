<template>
  <q-page>
    <div class="content">
      <div id="errors"></div>
      <form id="form">
        <input name="login" id="form-input" type="text" placeholder="user login name" autofocus/>
        <button type="submit" id="form-button">ADD</button>
      </form>
      <ul id="ul">
      </ul>
    </div>
    <div class="footer">
      <button type="button">Options</button>
    </div>
  </q-page>
</template>

<script setup>

// TODO: convert vue 3
// import { State } from '../state.js'
// import {
//   getTwitchUserByLogin,
// } from '../api.js'
// import {
//   getFullUsersOnStreams,
// } from '../utils.js'
//
// function getDomElements () {
//   const formElement = document.getElementById('form')
//   const inputElement = document.getElementById('form-input')
//   const buttonElement = document.getElementById('form-button')
//   const ulElement = document.getElementById('ul')
//   const liElements = document.querySelectorAll('.li')
//
//   return {
//     formElement,
//     inputElement,
//     buttonElement,
//     ulElement,
//     liElements
//   }
// }
//
// function elementsOnLoad (status = true) {
//   const {
//     inputElement,
//     buttonElement
//   } = getDomElements()
//
//   buttonElement.disabled = status
//   inputElement.disabled = status
//   buttonElement.textContent = status ? 'Loading...' : 'Add'
// }
//
// async function getUsers () {
//   return await State.users
// }
//
// async function addUser (userLogin) {
//   const actualUsers = (await getUsers()) ?? []
//
//   State.users = [
//     userLogin,
//     ...actualUsers,
//   ]
// }
//
// async function removeUser (userLogin) {
//   const actualUsers = (await getUsers()) ?? []
//
//   State.users = actualUsers.filter((u) => u !== userLogin)
// }
//
// function generateListListener () {
//   const {
//     liElements,
//   } = getDomElements()
//
//   liElements.forEach((e) => {
//     const deleteElement = e.getElementsByClassName('li-delete')[0]
//     const statusElement = e.getElementsByClassName('li-status')[0]
//
//     deleteElement.addEventListener('click', async () => {
//       await removeUser(deleteElement.getAttribute('data-id'))
//       generateList()
//     })
//
//     statusElement.addEventListener('click', async () => {
//       chrome.tabs.create({ url: `https://www.twitch.tv/${statusElement.getAttribute('data-id')}` })
//     })
//   })
// }
//
// async function updateListStatus () {
//   const {
//     liElements,
//   } = getDomElements()
//
//   const userLoginsOnStream = (await getFullUsersOnStreams()).map(u => u.user_login)
//
//   liElements.forEach((e) => {
//     const statusElement = e.getElementsByClassName('li-status')[0]
//     if (userLoginsOnStream.includes(statusElement.getAttribute('data-id'))) {
//       statusElement.style.background = '#10eb10'
//     } else {
//       statusElement.style.background = '#da043c'
//     }
//   })
// }
//
// function sendMessage (message) {
//   chrome.runtime.sendMessage(message)
// }
//
// function generateList () {
//   getUsers()
//     .then(async (users) => {
//       const {
//         liElements,
//         ulElement,
//       } = getDomElements()
//
//       liElements.forEach((e) => e.remove())
//
//       ;(users ?? []).forEach((u) => {
//         const ulLiElement = document.createElement('li')
//         ulLiElement.textContent = u
//         ulLiElement.classList.add('li')
//
//         const ulLiSpanStatusElement = document.createElement('span')
//         ulLiSpanStatusElement.classList.add('li-status')
//         ulLiSpanStatusElement.setAttribute('data-id', u)
//         ulLiElement.prepend(ulLiSpanStatusElement)
//
//         const ulLiSpanDeleteElement = document.createElement('span')
//         ulLiSpanDeleteElement.classList.add('li-delete')
//         ulLiSpanDeleteElement.setAttribute('data-id', u)
//         ulLiSpanDeleteElement.textContent = 'X'
//         ulLiElement.appendChild(ulLiSpanDeleteElement)
//
//         ulElement.appendChild(ulLiElement)
//       })
//
//       await updateListStatus()
//       generateListListener()
//     })
// }
//
// function printError (error) {
//   const errorsElement = document.getElementById('errors')
//   errorsElement.innerHTML = ''
//
//   const errorElement = document.createElement('p')
//
//   errorElement.textContent = error
//   errorElement.style.color = 'red'
//   errorsElement.appendChild(errorElement)
//
//   setTimeout(() => {
//     errorsElement.innerHTML = ''
//   }, 3000)
// }
//
// function main () {
//   generateList()
//   const buttonOptionsElement = document.querySelector('.footer > button')
//   buttonOptionsElement.addEventListener('click', () => {
//     chrome.runtime.openOptionsPage()
//   })
//
//   const {
//     formElement,
//     inputElement
//   } = getDomElements()
//
//   formElement.addEventListener('submit', async (e) => {
//     e.preventDefault()
//     const value = inputElement.value
//     const strippedValue = value.trim().toLowerCase()
//
//     if (strippedValue.length <= 1) {
//       inputElement.value = ''
//       printError('Too short')
//       elementsOnLoad(false)
//       return
//     }
//
//     elementsOnLoad(true)
//
//     const accessToken = await State.accessToken
//
//     if (typeof accessToken !== 'string') {
//       inputElement.value = ''
//       printError('Not connected')
//       return
//     }
//
//     getTwitchUserByLogin(strippedValue, accessToken)
//       .then((userValid) => {
//         elementsOnLoad(false)
//
//         if (userValid === null) {
//           const {
//             inputElement
//           } = getDomElements()
//
//           inputElement.value = ''
//           inputElement.focus()
//           printError('User not found')
//           return
//         }
//
//         addUser(strippedValue)
//           .then(() => {
//             const {
//               inputElement
//             } = getDomElements()
//
//             inputElement.value = ''
//             inputElement.focus()
//
//             sendMessage({
//               type: 'reset',
//             })
//             setTimeout(() => {
//               generateList()
//             }, 500)
//           })
//       })
//   })
// }
//
// main()

</script>

<style scoped>
html, body {
  margin: 0;
  background-color: #961ddc;
}

.content {
  min-width: 200px;
  min-height: 300px;

  padding: 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;

  text-align: center;

  max-height: 250px;
  overflow-x: auto;
}

input {
  height: 20px;
  width: 100%
}

button {
  height: 20px;
  width: 100%;
}

li {
  background-color: #e0e0e0;

  height: auto;
  width: 100%;

  position: relative;
  padding: 5px 0;
  font-weight: bold;
}

li .li-delete {
  width: 20px;
  height: 20px;

  position: absolute;
  top: 2px;
  right: 0;
  line-height: 20px;
  font-weight: bold;
  font-size: 20px;
  color: #da043c;
  cursor: pointer;
}

li .li-status {
  width: 15px;
  height: 15px;

  position: absolute;
  top: 4px;
  left: 3px;
  border-radius: 15px;
  background: #da043c;
  cursor: pointer;
}

</style>
