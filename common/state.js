export const State = {
  get accessToken () {
    return new Promise((resolve) => {
      chrome.storage.local.get('accessToken', r => resolve(r.accessToken))
    })
  },
  set accessToken (val) {
    return chrome.storage.local.set({ accessToken: val })
  },
  get users () {
    return new Promise((resolve) => {
      chrome.storage.local.get('users', r => resolve(r.users))
    })
  },
  set users (val) {
    return chrome.storage.local.set({ users: val })
  },
  get usersData () {
    return new Promise((resolve) => {
      chrome.storage.local.get('usersData', r => resolve(r.usersData))
    })
  },
  set usersData (val) {
    return chrome.storage.local.set({ usersData: val })
  },
  get settings () {
    return new Promise((resolve) => {
      chrome.storage.local.get('settings', r => resolve(r.settings))
    })
  },
  set settings (val) {
    return chrome.storage.local.set({ settings: val })
  }
}
