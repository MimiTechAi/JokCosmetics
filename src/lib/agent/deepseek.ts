import { DeepseekAPI } from 'deepseek-api';

export class DeepseekAgent {
  private client: DeepseekAPI;
  private conversation: any;

  constructor(apiKey: string) {
    this.client = new DeepseekAPI(apiKey);
    this.conversation = this.client.createConversation({
      model: 'deepseek-chat',
      temperature: 0.7,
      max_tokens: 1024
    });
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const systemPrompt = `Du bist ein freundlicher und professioneller Beauty-Assistent für Jok Cosmetics, 
      ein Salon spezialisiert auf Permanent Make-up und Wimpernverlängerung in Bad Liebenzell. 
      Beantworte Fragen zu Terminen, Dienstleistungen und allgemeinen Informationen.
      Sprich immer Deutsch und sei höflich und professionell.`;

      const response = await this.conversation.sendMessage({
        role: 'system',
        content: systemPrompt
      });

      const userResponse = await this.conversation.sendMessage({
        role: 'user',
        content: message
      });
      
      return userResponse.content;
    } catch (error) {
      console.error('Fehler bei der Deepseek-API:', error);
      throw error;
    }
  }
}
