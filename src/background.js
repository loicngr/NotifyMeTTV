import {
  extractTokenFromUrl,
  getFullUsersOnStreams,
  getTwitchOauthUrl,
} from './utils.js'
import {
  getTwitchCurrentUser,
} from './api.js'
import { State } from './state.js'
import {
  ALARM_API_FETCH_INTERVAL,
  ALARM_FETCH_INIT_KEY,
  NOTIFICATION_STREAM_START
} from './consts.js'

let initCount = 0

async function openTwitchOauth () {
  const url = getTwitchOauthUrl()
  if (url === false) {
    console.error('URL not valid')
    return false
  }

  return new Promise((res, rej) => {
    chrome.identity.launchWebAuthFlow({
      url,
      interactive: true
    }, async (flowRedirectUrl) => {
      const accessToken = extractTokenFromUrl(flowRedirectUrl)
      State.accessToken = accessToken

      const user = await getTwitchCurrentUser(accessToken)
      if (user === null) {
        return rej(false)
      }

      res(true)
    })
  })
}

async function notificationOnStream (options = {}, userStream) {
  await chrome.notifications.create(
    `${NOTIFICATION_STREAM_START}-${userStream.user_login}`,
    {
      title: userStream.user_name,
      iconUrl: chrome.runtime.getURL('src/assets/logo.jpg'),
      message: '',
      type: 'basic',
      priority: 2,
      isClickable: true,
      ...options,
    },
    () => {
      // createAudioWindow()
    }
  )
}

async function notify () {
  const usersData = await State.usersData
  const clonedUsersData = [...Object.values(usersData)]
  if (clonedUsersData.length === 0) {
    return
  }

  const usersNotNotify = clonedUsersData.filter((u) => u.notified === false)
  if (usersNotNotify.length === 0) {
    return
  }

  // Remove old notifications
  chrome.notifications.getAll((ids) => {
    for (const id of Object.keys(ids)) {
      chrome.notifications.clear(id)
    }
  })

  // Add event listeners for new notification
  chrome.notifications.onClicked.addListener((async function (a) {
    if (a.startsWith(NOTIFICATION_STREAM_START)) {
      const userLogin = a.split('-')[1]
      chrome.tabs.create({ url: `https://www.twitch.tv/${userLogin}` })
    }
  }))

  const newUserStream = {}
  for (const userStream of usersNotNotify) {
    await notificationOnStream({
      message: userStream.title,
      iconUrl: userStream.thumbnail_url.replace('{width}', 100).replace('{height}', 60),
      contextMessage: `${userStream.game_name} (${userStream.viewer_count} viewers)`,
    }, userStream)

    newUserStream[userStream.user_id] = {
      ...userStream,
      notified: true
    }
  }

  State.usersData = {
    ...usersData,
    ...newUserStream,
  }
}

async function main () {
  initCount = 0

  const usersData = (await State.usersData) ?? {}
  const usersOnStream = await getFullUsersOnStreams()
  const clonedUsersData = {}

  await Promise.all(usersOnStream.map(async (userOnStream) => {
    const userStreamId = userOnStream.user_id
    const storedUserData = userStreamId in usersData && usersData[userStreamId].id === userOnStream.id
      ? usersData[userStreamId]
      : { notified: false }

    clonedUsersData[userStreamId] = {
      ...userOnStream,
      ...storedUserData,
    }
  }))

  State.usersData = clonedUsersData
  await notify()
}

function handleTwitchOauth () {
  openTwitchOauth()
    .then(() => main())
    .catch(() => init())
}

async function init (accessToken) {
  initCount += 1

  if (initCount > 5) {
    console.error('loop init : ' + accessToken)
    return
  }

  if (typeof accessToken === 'undefined') {
    return handleTwitchOauth()
  }

  const userResponse = await getTwitchCurrentUser(accessToken)

  if (userResponse === null) {
    return handleTwitchOauth()
  }

  const alarmRunning = await chrome.alarms.get(ALARM_FETCH_INIT_KEY)
  if (!alarmRunning) {
    chrome.alarms.create(ALARM_FETCH_INIT_KEY, {
      periodInMinutes: ALARM_API_FETCH_INTERVAL
    })
  }

  await main()
}

chrome.alarms.onAlarm.addListener(async ({ name }) => {
  switch (name) {
    case ALARM_FETCH_INIT_KEY:
      State.accessToken
        .then(init)
      break
    default:
      break
  }
})

chrome.runtime.onMessage.addListener(async ({ type }) => {
  switch (type) {
    case 'reset':
      await main()
      break
    default:
      break
  }
})

State.accessToken
  .then(init)
