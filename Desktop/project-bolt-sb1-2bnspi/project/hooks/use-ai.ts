"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/lib/ai/service';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateResponse = async (prompt: string) => {
    if (!prompt?.trim()) {
      throw new Error('Prompt is required');
    }

    setIsLoading(true);

    try {
      const response = await aiService.generateResponse(prompt);
      
      if (!response) {
        throw new Error('No response from AI service');
      }

      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      toast({
        variant: "destructive",
        title: "AI Service Error",
        description: errorMessage,
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    isLoading,
  };
}