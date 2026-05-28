import { content } from './content'

export type AppId =
  | 'finder'
  | 'safari'
  | 'mail'
  | 'ical'
  | 'addressbook'
  | 'ichat'
  | 'itunes'
  | 'iphoto'
  | 'photobooth'
  | 'imovie'
  | 'garageband'
  | 'sysprefs'
  | 'trash'

export interface SearchRecord {
  appId: AppId
  sectionId: string
  label: string
  keywords: string[]
  preview: string
}

function buildIndex(): SearchRecord[] {
  const records: SearchRecord[] = []

  // Safari — bio
  records.push({
    appId: 'safari',
    sectionId: 'bio-summary',
    label: 'About Me',
    keywords: [content.bio.name, content.bio.title, ...content.bio.summary.split(' ')],
    preview: content.bio.summary.slice(0, 80) + '…',
  })
  records.push({
    appId: 'safari',
    sectionId: 'bio-skills',
    label: 'Skills',
    keywords: content.bio.skills,
    preview: content.bio.skills.join(', '),
  })
  records.push({
    appId: 'safari',
    sectionId: 'bio-interests',
    label: 'Interests',
    keywords: content.bio.interests,
    preview: content.bio.interests.join(', '),
  })

  // AddressBook — education
  content.education.forEach((edu, i) => {
    records.push({
      appId: 'addressbook',
      sectionId: `education-${i}`,
      label: `${edu.school}`,
      keywords: [edu.school, edu.degree, edu.field, ...edu.certifications],
      preview: `${edu.degree} in ${edu.field} · ${edu.dates}`,
    })
  })

  // iChat — employment
  content.employment.forEach((job, i) => {
    records.push({
      appId: 'ichat',
      sectionId: `job-${i}`,
      label: `${job.role} at ${job.company}`,
      keywords: [job.company, job.role, ...job.responsibilities],
      preview: `${job.role} · ${job.dates}`,
    })
  })

  // Mail — contact
  records.push({
    appId: 'mail',
    sectionId: 'contact',
    label: 'Contact',
    keywords: ['email', 'contact', 'github', 'instagram', content.contact.email],
    preview: content.contact.email,
  })

  return records
}

export const searchIndex = buildIndex()

export function search(query: string): SearchRecord[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return searchIndex.filter((r) =>
    r.label.toLowerCase().includes(q) ||
    r.preview.toLowerCase().includes(q) ||
    r.keywords.some((k) => k.toLowerCase().includes(q))
  )
}
