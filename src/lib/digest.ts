import 'server-only'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatDate } from '@/lib/format'

type DigestEvent = {
  title: string
  starts_at: string
  location_name: string | null
  is_online: boolean
  rsvp_url: string | null
  organizations: { name: string } | null
  id: string
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function eventHtml(event: DigestEvent) {
  const siteUrl = process.env.SITE_URL!
  const link = `${siteUrl}/events/${event.id}`
  const where = event.is_online ? 'Online' : event.location_name ?? ''
  const host = event.organizations?.name

  return `
    <tr><td style="padding: 16px 0; border-bottom: 1px solid #ffe3cf;">
      <p style="margin: 0; font-size: 14px; font-weight: bold; color: #4a4f6a;">
        ${escapeHtml(formatDate(event.starts_at))}
      </p>
      <p style="margin: 4px 0; font-size: 19px; font-weight: bold;">
        <a href="${escapeHtml(link)}" style="color: #1f2440;">${escapeHtml(event.title)}</a>
      </p>
      <p style="margin: 0; font-size: 15px; color: #4a4f6a;">
        ${escapeHtml(where)}${host ? ` · Hosted by ${escapeHtml(host)}` : ''}
      </p>
    </td></tr>
  `
}

function buildDigestHtml(events: DigestEvent[], unsubscribeUrl: string) {
  const siteUrl = process.env.SITE_URL!

  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2440;">
      <div style="background: #ffd23f; padding: 24px; border-radius: 16px 16px 0 0;">
        <h1 style="margin: 0; font-size: 26px;">Show Up SOKY ☀️</h1>
        <p style="margin: 6px 0 0; font-size: 16px;">This week in South Central Kentucky</p>
      </div>
      <div style="background: #fffbf0; padding: 8px 24px 24px; border-radius: 0 0 16px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${events.map(eventHtml).join('')}
        </table>
        <p style="margin: 28px 0 8px;">
          <a href="${siteUrl}"
             style="background: #1f2440; color: #fffbf0; padding: 12px 22px; border-radius: 999px;
                    text-decoration: none; font-weight: bold;">
            See the full calendar
          </a>
        </p>
      </div>
      <p style="font-size: 13px; color: #4a4f6a; text-align: center; margin-top: 20px;">
        You’re getting this because you signed up at Show Up SOKY.<br />
        <a href="${unsubscribeUrl}" style="color: #4a4f6a;">Unsubscribe</a>
      </p>
    </div>
  `
}

export async function sendWeeklyDigest() {
  const supabase = createAdminClient()

  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('id, title, starts_at, location_name, is_online, rsvp_url, organizations ( name )')
    .eq('status', 'approved')
    .gte('starts_at', now.toISOString())
    .lt('starts_at', weekFromNow.toISOString())
    .order('starts_at', { ascending: true })

  if (eventsError) throw eventsError
  const events = (eventsData ?? []) as unknown as DigestEvent[]

  if (events.length === 0) {
    return { sent: 0, reason: 'No events this week' }
  }

  const { data: subscribers, error: subsError } = await supabase
    .from('subscribers')
    .select('email, unsubscribe_token')
    .eq('confirmed', true)

  if (subsError) throw subsError
  if (!subscribers?.length) {
    return { sent: 0, reason: 'No confirmed subscribers' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const subject = `This week: ${events.length} event${events.length === 1 ? '' : 's'} in SOKY`

  const emails = subscribers.map((sub) => {
    const unsubscribeUrl = `${process.env.SITE_URL}/unsubscribe?token=${sub.unsubscribe_token}`
    return {
      from: process.env.EMAIL_FROM!,
      to: sub.email,
      subject,
      html: buildDigestHtml(events, unsubscribeUrl),
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
    }
  })

  let sent = 0
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100)
    const { error } = await resend.batch.send(batch)
    if (error) throw new Error(`Batch starting at ${i} failed: ${error.message}`)
    sent += batch.length
  }

  return { sent, events: events.length }
}