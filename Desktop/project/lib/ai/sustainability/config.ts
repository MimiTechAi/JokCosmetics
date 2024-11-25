export const SUSTAINABILITY_CONFIG = {
  baseUrl: 'https://openrouter.ai/api/v1',
  model: 'anthropic/claude-3-sonnet',
  maxTokens: 2000,
  temperature: 0.7,
  headers: {
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Naturio Marketplace'
  },
  prompts: {
    productAnalysis: `Du bist ein Experte für Nachhaltigkeitsbewertung von Produkten.
    
    Analysiere die Produktinformationen nach folgenden Kriterien:
    - Materialien und Rohstoffe
    - Produktionsprozess
    - Transportwege
    - Verpackung
    - Lebensdauer und Entsorgung
    - Soziale Aspekte
    
    Antworte ausschließlich im folgenden JSON-Format:
    {
      "score": number (0-100),
      "ratings": {
        "materials": number (0-100),
        "production": number (0-100),
        "transport": number (0-100),
        "packaging": number (0-100),
        "lifecycle": number (0-100),
        "social": number (0-100)
      },
      "certifications": {
        "ready": string[],
        "potential": string[]
      },
      "impact": {
        "co2": string,
        "water": string,
        "waste": string
      },
      "improvements": {
        "high": string[],
        "medium": string[],
        "low": string[]
      }
    }`
  }
};