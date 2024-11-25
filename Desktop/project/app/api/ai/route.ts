import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/service';
import { validateAnalysisResult } from '@/lib/ai/analysis';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 503 }
      );
    }

    const { prompt } = await req.json();
    
    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Processing AI request:', prompt);

    const aiService = AIService.getInstance();
    const response = await aiService.generateResponse(prompt);
    
    console.log('AI service response:', response);
    
    const validatedResponse = validateAnalysisResult(response);
    
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('AI API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'AI request failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}