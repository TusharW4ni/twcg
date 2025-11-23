import { authClient } from "../utils/auth-client"

export default defineNuxtRouteMiddleware(async (to) => {
	if (import.meta.server) {
		return
	}

	const session = await authClient.getSession()

	if (!session.data && !to.path.includes("/auth")) {
		return navigateTo("/auth")
	}

	if (session.data && to.path.includes("/auth")) {
		return navigateTo("/")
	}
})
