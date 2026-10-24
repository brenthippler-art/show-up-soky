export const FOCUS_AREAS = [
  { value: 'voting_rights', label: 'Voting rights' },
  { value: 'racial_justice', label: 'Racial justice' },
  { value: 'lgbtq_rights', label: 'LGBTQ+ rights' },
  { value: 'immigrant_rights', label: 'Immigrant rights' },
  { value: 'workers_rights', label: 'Workers’ rights' },
  { value: 'housing', label: 'Housing' },
  { value: 'education', label: 'Education' },
  { value: 'environment', label: 'Environment' },
  { value: 'health_care', label: 'Health care' },
  { value: 'disability_rights', label: 'Disability rights' },
  { value: 'community_aid', label: 'Community aid' },
  { value: 'other', label: 'Other' },
] as const

export type FocusArea = (typeof FOCUS_AREAS)[number]['value']

export function isFocusArea(value: string): value is FocusArea {
  return FOCUS_AREAS.some((area) => area.value === value)
}

export function focusLabel(value: string) {
  return FOCUS_AREAS.find((area) => area.value === value)?.label ?? value
}