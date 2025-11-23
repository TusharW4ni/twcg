<script setup lang="ts">
const users = await useFetch("/api/get/users")
console.log({users: users.data.value})
</script>
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
