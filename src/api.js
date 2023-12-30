import { TWITCH_CLIENT_ID } from './consts.js'

export async function getTwitchCurrentUser (twitchAccessToken) {
  const request = await fetch('https://api.twitch.tv/helix/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${twitchAccessToken}`,
      'Client-ID': TWITCH_CLIENT_ID
    },
    mode: 'cors',
    cache: 'default'
  })

  if (request.ok) {
    const response = await request.json()

    if (
      typeof response !== 'undefined' &&
      typeof response.data !== 'undefined'
    ) {
      return response.data[0] ?? null
    }
  }

  return null
}

export async function getTwitchUserByLogin (userLogin, twitchAccessToken) {
  const request = await fetch(`https://api.twitch.tv/helix/users?login=${userLogin}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${twitchAccessToken}`,
      'Client-ID': TWITCH_CLIENT_ID
    },
    mode: 'cors',
    cache: 'default'
  })

  if (request.ok) {
    const response = await request.json()

    if (
      typeof response !== 'undefined' &&
      typeof response.data !== 'undefined'
    ) {
      return response.data[0] ?? null
    }
  }

  return null
}

export async function getTwitchUserStream (userLogin, twitchAccessToken) {
  // TODO: pagination (https://dev.twitch.tv/docs/api/reference/#get-streams)
  const request = await fetch(`https://api.twitch.tv/helix/streams?user_login=${userLogin}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${twitchAccessToken}`,
      'Client-ID': TWITCH_CLIENT_ID
    },
    mode: 'cors',
    cache: 'default'
  })

  if (request.ok) {
    const response = await request.json()

    if (
      typeof response !== 'undefined' &&
      typeof response.data !== 'undefined'
    ) {
      return response.data[0] ?? null
    }
  }

  return null
}
