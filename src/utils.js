import {
  TWITCH_CLIENT_ID,
  TWITCH_REDIRECT_URL,
  TWITCH_SCOPES
} from './consts.js'
import { State } from './state.js'
import {
  getFullTwitchUserStreams,
  getTwitchUserStream
} from './api.js'

export function getTwitchOauthUrl () {
  if (!TWITCH_CLIENT_ID) {
    console.error('Twitch app client id not find')
    return false
  }

  let authURL = 'https://id.twitch.tv/oauth2/authorize'
  authURL += `?client_id=${TWITCH_CLIENT_ID}`
  authURL += `&response_type=token`
  authURL += `&redirect_uri=${TWITCH_REDIRECT_URL}`
  authURL += `&scope=${encodeURIComponent(TWITCH_SCOPES.split(',').join(' '))}`

  return authURL
}

export async function getUsersOnStreams () {
  const accessToken = await State.accessToken
  const userLogins = (await State.users) ?? []
  const users = await Promise.all(userLogins.map((userLogin) => getTwitchUserStream(userLogin, accessToken)))
  return users.filter((u) => u !== null)
}

export async function getFullUsersOnStreams () {
  const accessToken = await State.accessToken
  const userLogins = (await State.users) ?? []
  const users = await getFullTwitchUserStreams([], userLogins, accessToken)
  return users.filter((u) => u !== null)
}

export function clearStorage () {
  chrome.storage.local.clear()
  chrome.storage.session.clear()
}

export function extractTokenFromUrl (url) {
  const rawAccessToken = url.substring(url.indexOf('access_token=') + 13)
  return rawAccessToken.substring(0, rawAccessToken.indexOf('&'))
}
