<script setup lang="ts">
import { theme } from 'ant-design-vue'
import CreateHomework from '@/components/CreateHomework.vue'
import { ref } from 'vue'

const themeName = ref<'light' | 'dark'>('light')

const changeTheme = (value: 'light' | 'dark') => {
  themeName.value = value
  document.documentElement.setAttribute('data-theme', value)
}
const themeChanged = (value: 'light' | 'dark', event: MouseEvent) => {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const isDark = value === 'dark'
  changeTheme(value)
  return;
  // // @ts-ignore
  // if (!document.startViewTransition) {
  //   changeTheme(value)
  //   return
  // }
  // // @ts-ignore
  // const transition = document.startViewTransition(() => {
  //   changeTheme(value)
  // })

  // transition.ready.then(() => {
  //   const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
  //   document.documentElement.animate(
  //     {
  //       clipPath: !isDark ? [...clipPath].reverse() : clipPath
  //     },
  //     {
  //       duration: 400,
  //       easing: 'ease-in',
  //       pseudoElement: !isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
  //     }
  //   )
  // })
}
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#20BEC8'
      },
      algorithm: themeName === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
    }"
  >
    <CreateHomework @theme-changed="themeChanged" />
  </a-config-provider>
</template>
