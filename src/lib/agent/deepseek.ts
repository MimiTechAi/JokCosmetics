import OpenAI from 'openai';

export class DeepseekAgent {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com/v1'
    });
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const systemPrompt = `Du bist ein freundlicher und professioneller Beauty-Assistent für Jok Cosmetics, 
      ein Salon spezialisiert auf Permanent Make-up und Wimpernverlängerung in Bad Liebenzell. 
      Beantworte Fragen zu Terminen, Dienstleistungen und allgemeinen Informationen.
      Sprich immer Deutsch und sei höflich und professionell.`;

      const response = await this.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      });
      
      return response.choices[0]?.message?.content || 'Entschuldigung, ich konnte keine Antwort generieren.';
    } catch (error) {
      console.error('Fehler bei der Deepseek-API:', error);
      throw error;
    }
  }
}
