<template>
  <q-layout
    view="lHh Lpr lFf"
    class="bg-deep-purple-6"
    :style="vStyle"
  >
    <q-page-container>
      <options-page/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import OptionsPage from 'pages/OptionsPage.vue'

const vStyle = computed(() => {
  return {
    width: '100vw',
    height: '100vh'
  }
})
</script>
