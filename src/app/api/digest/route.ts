import { NextResponse } from 'next/server'
import { sendWeeklyDigest } from '@/lib/digest'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not set' }, { status: 500 })
  }

  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await sendWeeklyDigest()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Digest failed:', error)
    return NextResponse.json({ error: 'Digest failed' }, { status: 500 })
  }
}