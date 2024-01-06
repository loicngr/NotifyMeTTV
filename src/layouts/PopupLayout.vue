<template>
  <q-layout
    view="lHh Lpr lFf"
    class="bg-deep-purple-6"
    :style="vStyle"
  >
    <q-page-container>
      <popup-page/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import PopupPage from 'pages/PopupPage.vue'

const vStyle = computed(() => {
  if (typeof chrome?.storage?.local === 'undefined') {
    return {
      width: '100vw',
      height: '100vh'
    }
  }

  return {
    width: '300px',
    height: '400px'
  }
})
</script>
