import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "sqlite"
	}),
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "sign-in") {
					console.log({ otp })
				}
			}
		})
	]
});
