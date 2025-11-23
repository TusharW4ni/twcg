<script setup lang="ts">
import {authClient} from "../utils/auth-client"

async function logout() {
	await authClient.signOut();
	return navigateTo("/auth")
}
</script>

<template>
	<button @click="logout">logout</button>
	<div>
		Signed in
	</div>
</template>
