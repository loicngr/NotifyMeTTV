import {
  STORE_ACCESS_TOKEN_KEY,
  STORE_USERS_DATA_KEY,
  STORE_USERS_KEY
} from './consts.js'

export const State = {
  get [STORE_ACCESS_TOKEN_KEY] () {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORE_ACCESS_TOKEN_KEY], r => resolve(r[STORE_ACCESS_TOKEN_KEY]))
    })
  },
  set [STORE_ACCESS_TOKEN_KEY] (val) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORE_ACCESS_TOKEN_KEY]: val }).then(() => resolve(true))
    })
  },
  get [STORE_USERS_KEY] () {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORE_USERS_KEY], r => resolve(r[STORE_USERS_KEY]))
    })
  },
  set [STORE_USERS_KEY] (val) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORE_USERS_KEY]: val }).then(() => resolve(true))
    })
  },
  get [STORE_USERS_DATA_KEY] () {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORE_USERS_DATA_KEY], r => resolve(r[STORE_USERS_DATA_KEY]))
    })
  },
  set [STORE_USERS_DATA_KEY] (val) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORE_USERS_DATA_KEY]: val }).then(() => resolve(true))
    })
  },
}
