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

export async function getFullTwitchUserStreams (data, users, twitchAccessToken) {
  data ??= []
  users ??= []

  if (users.length === 0) {
    return data
  }

  let path = 'https://api.twitch.tv/helix/streams?first=100'
  path += `&user_login=${users.splice(0, 100).join('&user_login=')}`

  const request = await fetch(path, {
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

    if (typeof response !== 'undefined') {
      data = [
        ...data,
        ...(response.data ?? [])
      ]

      return getFullTwitchUserStreams(
        data,
        users,
        twitchAccessToken
      )
    }
  }

  return []
}

export async function getTwitchUserStream (userLogin, twitchAccessToken) {
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
