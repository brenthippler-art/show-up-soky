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

export function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type Notification = {
  subject: string
  heading: string
  rows: [label: string, value: string | null | undefined][]
  buttonLabel: string
  buttonPath: string
}

export async function sendAdminNotification({ subject, heading, rows, buttonLabel, buttonPath }: Notification) {
  const to = process.env.CONTACT_EMAIL
  if (!to) return

  const tableRows = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: bold; vertical-align: top; white-space: nowrap;">
            ${escapeHtml(label)}
          </td>
          <td style="padding: 6px 0;">${escapeHtml(value!)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2440;">
      <div style="background: #ffd23f; padding: 20px 24px; border-radius: 16px 16px 0 0;">
        <p style="margin: 0; font-size: 14px; font-weight: bold;">Show Up SOKY · Needs review</p>
        <h1 style="margin: 6px 0 0; font-size: 22px;">${escapeHtml(heading)}</h1>
      </div>
      <div style="background: #fffbf0; padding: 20px 24px; border-radius: 0 0 16px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 15px;">
          ${tableRows}
        </table>
        <p style="margin: 24px 0 4px;">
          <a href="${process.env.SITE_URL}${buttonPath}"
             style="background: #1f2440; color: #fffbf0; padding: 12px 22px; border-radius: 999px;
                    text-decoration: none; font-weight: bold;">
            ${escapeHtml(buttonLabel)}
          </a>
        </p>
      </div>
    </div>
  `

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  })

  if (error) throw new Error(`Notification failed: ${error.message}`)
}