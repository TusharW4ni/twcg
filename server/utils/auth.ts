import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import nodemailer from "nodemailer"

const rc = useRuntimeConfig();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: rc.USER,
		pass: rc.PASS,
	}
})

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "sqlite"
	}),
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "sign-in") {
					console.log({ otp })
					await transporter.sendMail({
						from: `${rc.USER}`,
						to: `${email}`,
						subject: "TWCGateway Sign-In OTP",
						html: `OTP: <b>${otp}</b>`
					})
				}
			}
		})
	]
});
