import Deepseek from 'deepseek-api';

export class DeepseekAgent {
  private client: any;

  constructor(apiKey: string) {
    this.client = new Deepseek(apiKey);
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const systemPrompt = `Du bist ein freundlicher und professioneller Beauty-Assistent für Jok Cosmetics, 
      ein Salon spezialisiert auf Permanent Make-up und Wimpernverlängerung in Bad Liebenzell. 
      Beantworte Fragen zu Terminen, Dienstleistungen und allgemeinen Informationen.
      Sprich immer Deutsch und sei höflich und professionell.`;

      const response = await this.client.sendMessage({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: 'deepseek-chat',
        temperature: 0.7,
        max_tokens: 1024
      });
      
      return response?.content || 'Entschuldigung, ich konnte keine Antwort generieren.';
    } catch (error) {
      console.error('Fehler bei der Deepseek-API:', error);
      throw error;
    }
  }
}
