<script setup lang="ts">
import CreateHomework from '@/components/CreateHomework.vue'
</script>

<template>
  <a-config-provider  :theme="{
      token: {
        colorPrimary: '#20BEC8',
      },
    }">
    <CreateHomework />
  </a-config-provider>
</template>
