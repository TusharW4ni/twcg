<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { authClient } from "../../utils/auth-client"

// 1. Define the Form State
const state = reactive({
  email: '',
  otp: ''
})

const isOtpSent = ref(false)
const isLoading = ref(false)
const toast = useToast() // Assuming you want feedback

// 2. Custom "Plain TS" Validation Logic
const validate = (state: any): FormError[] => {
  const errors: FormError[] = []

  // Email Validation
  if (!state.email) {
    errors.push({ name: 'email', message: 'Email is required' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    // Simple Regex for basic email format
    errors.push({ name: 'email', message: 'Please enter a valid email' })
  }

  // OTP Validation (Only checks if we are in the submission phase)
  if (isOtpSent.value && !state.otp) {
    errors.push({ name: 'otp', message: 'OTP is required' })
  } else if (isOtpSent.value && state.otp.length < 6) {
    errors.push({ name: 'otp', message: 'OTP must be at least 6 characters' })
  }

  return errors
}

// 3. Handle "Send OTP" Action
async function onSendOtp() {
  // Manual check to ensure email is valid before sending API request
  if (!state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    // We can rely on the form to show errors, or force validation here
    // For simplicity, we just return if empty, allowing the UI to react naturally
    return 
  }

  isLoading.value = true
  try {
    await authClient.emailOtp.sendVerificationOtp({
      email: state.email,
      type: "sign-in"
    })
    isOtpSent.value = true
    toast.add({ title: 'OTP Sent', description: 'Check your inbox.' })
  } catch (error) {
    // Handle API errors
  } finally {
    isLoading.value = false
  }
}

// 4. Handle Final "Sign In" Submit
async function onSubmit(event: FormSubmitEvent<typeof state>) {
  isLoading.value = true
  try {
    const res = await authClient.signIn.emailOtp({
      email: event.data.email,
      otp: event.data.otp
    })
    
    if (res.data?.user) {
      return navigateTo("/")
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-screen w-screen flex justify-center items-center bg-gray-50 dark:bg-gray-950">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="text-xl font-bold">Sign In</h1>
      </template>

      <UForm 
        :state="state" 
        :validate="validate" 
        class="space-y-4" 
        @submit="onSubmit"
      >
        
        <UFormField label="Email" name="email">
          <UInput 
            v-model="state.email" 
            placeholder="you@example.com" 
            :disabled="isOtpSent"
            icon="i-heroicons-envelope"
          />
        </UFormField>

        <UFormField v-if="isOtpSent" label="One-Time Password" name="otp">
          <UInput 
            v-model="state.otp" 
            type="text" 
            placeholder="123456" 
            icon="i-heroicons-key"
          />
        </UFormField>

        <div class="pt-2">
          <UButton 
            v-if="!isOtpSent" 
            block 
            :loading="isLoading"
            type="button" 
            @click="onSendOtp"
          >
            Send OTP
          </UButton>

          <UButton 
            v-else 
            block 
            :loading="isLoading"
            type="submit"
          >
            Sign In
          </UButton>
        </div>
        
      </UForm>
    </UCard>
  </div>
</template>
