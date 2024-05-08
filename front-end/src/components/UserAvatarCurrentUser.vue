<script setup>
import UserAvatar from '@/components/UserAvatar.vue'

</script>

<!-- TODO: Inserire dati da api me -->
<template>
  <UserAvatar username="John Doe" avatar="">
    <slot />
  </UserAvatar>
</template>
