declare module 'deepseek-api' {
  export class DeepseekAPI {
    constructor(apiKey: string);
    
    createConversation(options: {
      model: string;
      temperature?: number;
      max_tokens?: number;
    }): DeepseekConversation;
  }

  export interface DeepseekMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  export interface DeepseekResponse {
    content: string;
  }

  export interface DeepseekConversation {
    sendMessage(message: DeepseekMessage): Promise<DeepseekResponse>;
  }
}
