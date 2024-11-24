export async function analyzeProduct(description: string) {
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Analyse fehlgeschlagen');
    }

    return await response.json();
  } catch (error) {
    console.error('Analysis Service Error:', error);
    throw error;
  }
}