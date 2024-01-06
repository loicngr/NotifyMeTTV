<template>
  <q-page class="q-pa-sm">
    <template
      v-if="typeof accessToken === 'string'"
    >
      <q-form
        class="row"
        ref="formRef"
        @submit.prevent="validateSubmit"
      >
        <q-input
          v-model.trim="userLogin"
          dense
          lazy-rules
          :rules="[
          val => !!val || '* Required',
          val => val.length >= 2 || 'Too short',
        ]"
          ref="inputRef"
          type="text"
          :error="typeof error === 'string'"
          bg-color="white"
          prefix="https://twitch.tv/"
          :readonly="loading"
          class="col-12"
          label-slot
          :error-message="error"
          outlined
          clearable
          color="white"
          maxlength="40"
          :loading="loading"
        >
          <template #label>
          <span class="text-weight-bold text-deep-purple-6">
            User login
          </span>
          </template>
          <template #append>
            <q-btn
              round
              dense
              flat
              :loading="loading"
              color="deep-purple-6"
              icon="add"
              @click.prevent="validateSubmit"
            />
          </template>
        </q-input>
      </q-form>

      <q-virtual-scroll
        style="max-height: 300px;"
        :items="usersSorted"
        separator
        v-slot="{ item: user }"
      >
        <q-item
          :key="user.user_login"
          class="items-center"
          dense
        >
          <q-item-section
            class="text-white cursor-pointer"
            @click="openTab(`https://www.twitch.tv/${user.user_login}`)"
          >
            {{ user.user_login }} <br>
            <span
              v-if="typeof user.data !== 'undefined'"
              class="text-caption"
              style="font-size: 0.6rem !important;"
            >
              {{ user.data.game_name }} ({{ user.data.viewer_count }} viewers)
            </span>
          </q-item-section>
          <q-item-section
            avatar
            class="inline-block"
          >
            <q-icon
              :color="user.online ? 'green' : 'red'"
              name="circle"
              class="q-mr-sm"
            />
            <q-icon
              color="red"
              name="close"
              @click="removeUser(user.user_login) && refreshUsers()"
              class="cursor-pointer"
            />
          </q-item-section>
        </q-item>
      </q-virtual-scroll>
    </template>
    <div
      v-else
      class="text-center text-weight-bold text-white"
    >
      Status: Not connected <br>
      <q-btn
        class="q-mt-md"
        label="Connect"
        text-color="deep-purple-6"
        color="white"
        @click="onConnect"
      />
    </div>

    <q-page-sticky
      position="bottom-right"
      :offset="[5, 5]"
    >
      <q-btn
        icon="settings"
        dense
        fab-mini
        unelevated
        text-color="white"
        @click="openOption"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import {
  computed,
  ref,
  watchEffect
} from 'vue'
import { getTwitchUserByLogin } from '../../common/api'
import { State } from '../../common/state'
import { getFullUsersOnStreams } from '../../common/utils'

const error = ref()
const loading = ref(false)
const userLogin = ref()
const inputRef = ref(null)
const formRef = ref(null)
const users = ref([])
const accessToken = ref()

const usersSorted = computed(() => {
  return (users.value ?? []).sort((a, b) => {
    return (a.online === b.online)
      ? 0
      : a.online
        ? -1
        : 1
  })
})

watchEffect(async () => {
  accessToken.value = await State.accessToken
  await refreshUsers()
})

chrome?.runtime?.onMessage?.addListener(async ({ type }) => {
  switch (type) {
    case 'connected':
      accessToken.value = await State.accessToken
      await refreshUsers()
      break
    default:
      break
  }
})

function openTab (url) {
  chrome.tabs.create({ url })
}

function openOption () {
  chrome.runtime.openOptionsPage()
}

function onConnect () {
  chrome?.runtime?.sendMessage({
    type: 'reset-init'
  })
}

async function refreshUsers () {
  const usersOnStream = await getFullUsersOnStreams()
  const userLoginsOnStream = usersOnStream.map(u => u.user_login)

  users.value = (await getUsers()).map((user) => ({
    user_login: user,
    online: userLoginsOnStream.includes(user),
    data: usersOnStream.find((userOnStream) => userOnStream.user_login === user)
  }))
}

async function removeUser (userLogin) {
  const actualUsers = await getUsers()
  State.users = actualUsers.filter((u) => u !== userLogin)
}

async function getUsers () {
  return (await State.users) ?? []
}

async function addUser (userLogin) {
  const actualUsers = await getUsers()

  State.users = [
    userLogin,
    ...actualUsers
  ]
}

async function validateSubmit () {
  loading.value = true
  const isValid = await formRef.value.validate()

  if (!isValid) {
    loading.value = false
    return
  }

  const strippedUserLogin = userLogin.value.toLowerCase()

  const fetchedUser = await getTwitchUserByLogin(strippedUserLogin, accessToken.value)

  if (fetchedUser === null) {
    error.value = 'User not found'
    loading.value = false
    return
  }

  await addUser(fetchedUser.login)

  userLogin.value = undefined
  loading.value = false
  error.value = undefined
  inputRef.value?.focus()

  await chrome?.runtime?.sendMessage({
    type: 'reset'
  })

  await formRef.value.resetValidation()
  await refreshUsers()
}

</script>
