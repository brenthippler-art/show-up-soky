import 'server-only'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail(to: string, confirmToken: string) {
  const confirmUrl = `${process.env.SITE_URL}/subscribe/confirm?token=${confirmToken}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1f2440;">
      <div style="background: #ffd23f; padding: 24px; border-radius: 16px 16px 0 0;">
        <h1 style="margin: 0; font-size: 26px;">Show Up SOKY ☀️</h1>
      </div>
      <div style="background: #fffbf0; padding: 24px; border-radius: 0 0 16px 16px;">
        <p style="font-size: 17px;">Thanks for signing up! Confirm your email and we'll send you a
        short list of community events every Monday.</p>
        <p style="margin: 28px 0;">
          <a href="${confirmUrl}"
             style="background: #1f2440; color: #fffbf0; padding: 14px 24px; border-radius: 999px;
                    text-decoration: none; font-weight: bold;">
            Confirm my subscription
          </a>
        </p>
        <p style="font-size: 14px; color: #4a4f6a;">Didn't sign up? Ignore this email and you won't
        hear from us.</p>
      </div>
    </div>
  `

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: 'Confirm your Show Up SOKY subscription',
    html,
  })

  if (error) throw new Error(`Email failed: ${error.message}`)
}