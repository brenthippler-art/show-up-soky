import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Rules match by prefix: "/events?" blocks every /events?date=…&month=… variant
        disallow: ['/events?', '/events/*/ics', '/admin', '/login', '/api/', '/subscribe', '/unsubscribe'],
      },
    ],
  }
}