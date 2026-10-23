import type { EventType } from '@/types/event'

export const EVENT_TYPE_ORDER: EventType[] = [
  'rally', 'meeting', 'volunteer', 'town_hall', 'training', 'social', 'other',
]

export const EVENT_TYPE_STYLES: Record<EventType, { label: string; bar: string; pill: string }> = {
  rally: { label: 'Rally', bar: 'bg-berry', pill: 'bg-berry-light' },
  meeting: { label: 'Meeting', bar: 'bg-sky', pill: 'bg-sky-light' },
  volunteer: { label: 'Volunteer', bar: 'bg-meadow', pill: 'bg-meadow-light' },
  town_hall: { label: 'Town Hall', bar: 'bg-tangerine', pill: 'bg-tangerine-light' },
  training: { label: 'Training', bar: 'bg-sunshine', pill: 'bg-sunshine-light' },
  social: { label: 'Social', bar: 'bg-berry', pill: 'bg-berry-light' },
  other: { label: 'Other', bar: 'bg-sky', pill: 'bg-sky-light' },
}

export function isEventType(value: string | undefined): value is EventType {
  return !!value && (EVENT_TYPE_ORDER as string[]).includes(value)
}