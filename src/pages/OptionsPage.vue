<template>
  <q-page
    class="flex justify-center items-center"
  >
    <div class="column">
      <q-card class="col">
        <q-card-section>
          <span class="text-caption full-width">
            {{ status }}
          </span>

          <q-form
            @submit.prevent="onSubmit"
            class="row"
          >
            <q-checkbox
              v-model="sound"
              label="Audio (notification)"
              class="col-12"
            />

            <div class="row col-12 q-mt-md">
              <q-btn
                @click="resetAll"
                label="Reset all"
                class="col-6"
                dense
              />

              <q-btn
                type="submit"
                label="Save"
                class="col-5 offset-1"
                dense
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <div class="col text-center q-mt-md text-white">
        By <a
        class="cursor-pointer text-weight-bold"
        @click="openTab('https://x.com/zaekof')"
      >
        Zaekof
      </a>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {
  onMounted,
  ref
} from 'vue'
import { State } from '../../common/state'
import {
  clearStorage,
  removeAllNotifications
} from '../../common/utils'

const status = ref('')
const sound = ref(false)

function openTab (url) {
  chrome.tabs.create({ url })
}

function setStatus (text) {
  status.value = text

  setTimeout(() => {
    status.value = ''
  }, 2000)
}

function resetAll () {
  clearStorage()
  chrome.runtime.sendMessage({ type: 'reset-init' })
  setTimeout(async () => {
    await applySettings()
  }, 500)
  removeAllNotifications()
  setStatus('Settings reset to default')
}

function saveSettings (settings = {}) {
  State.settings = settings
  setStatus('Settings saved')
}

async function getSettings () {
  return await State.settings ?? {}
}

async function applySettings () {
  const settings = await getSettings()
  sound.value = settings.audio ?? false
}

function onSubmit () {
  saveSettings({
    audio: sound.value ?? false
  })
}

onMounted(async () => {
  await applySettings()
})

</script>

<style scoped>

</style>
