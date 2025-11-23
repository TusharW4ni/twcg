<script setup lang="ts">
import {authClient} from "../../utils/auth-client.ts"

const email = ref('');
const otp = ref('')

async function sendOtp() {
	await authClient.emailOtp.sendVerificationOtp({
		email: email.value,
		type: "sign-in"
	})
}

async function signIn() {
	const res = await authClient.signIn.emailOtp({
		email: email.value,
		otp: otp.value
	})
	console.log({res})

	if (res.data.user) {
		return navigateTo("/")
	}
}
</script>

<template>
	<input v-model="email"/>
	<button @click="sendOtp">send otp</button>
	<input v-model="otp"/>
	<button @click="signIn">sign in</button>
</template>
