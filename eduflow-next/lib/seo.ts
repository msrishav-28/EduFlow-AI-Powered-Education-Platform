export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'EduFlow',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    description: 'AI-powered study companion: chat, summarization, MCQs, code explanation.',
    url: 'https://eduflow.example.com',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  }
}

export function moduleMeta(title: string, description: string) {
  return {
    title: `${title} | EduFlow`,
    description,
    openGraph: {
      title: `${title} | EduFlow`,
      description,
      type: 'website'
    },
    twitter: { card: 'summary', title: `${title} | EduFlow`, description }
  }
}
