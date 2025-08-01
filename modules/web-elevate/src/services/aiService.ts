// AI Service for WebElevate Debug Platform
// Integrates with Groq API for AI-powered debugging assistance

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface AIAnalysisRequest {
  code: string;
  language: string;
  errorMessage?: string;
  context?: string;
}

interface AIAnalysisResponse {
  explanation: string;
  suggestions: string[];
  codeExample?: string;
  confidence: number;
}

class AIService {
  private apiKey: string;
  private apiUrl: string;
  private isEnabled: boolean;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.apiUrl = import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com/openai/v1';
    this.isEnabled = import.meta.env.VITE_AI_ASSISTANCE_ENABLED === 'true' && !!this.apiKey;
  }

  /**
   * Check if AI service is available
   */
  isAvailable(): boolean {
    return this.isEnabled && !!this.apiKey;
  }

  /**
   * Analyze code for potential issues and provide suggestions
   */
  async analyzeCode(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available');
    }

    const prompt = this.buildAnalysisPrompt(request);
    
    try {
      const response = await this.makeGroqRequest(prompt, 'code-analysis');
      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze code with AI');
    }
  }

  /**
   * Explain a specific error or bug
   */
  async explainError(code: string, errorMessage: string, language: string): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available');
    }

    const prompt = `
You are a debugging expert. Explain this ${language} error in simple terms:

Error: ${errorMessage}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide a clear, concise explanation of:
1. What the error means
2. Why it's happening in this specific code
3. How to fix it

Keep the explanation beginner-friendly and practical.
`;

    try {
      const response = await this.makeGroqRequest(prompt, 'error-explanation');
      return response.choices[0]?.message?.content || 'Unable to explain error';
    } catch (error) {
      console.error('Error explanation failed:', error);
      throw new Error('Failed to explain error with AI');
    }
  }

  /**
   * Generate hints for debugging challenges
   */
  async generateHint(
    challengeDescription: string, 
    userCode: string, 
    language: string,
    hintLevel: 'gentle' | 'specific' | 'direct' = 'gentle'
  ): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available');
    }

    const hintPrompts = {
      gentle: 'Give a subtle hint that guides thinking without revealing the solution',
      specific: 'Provide a more specific hint pointing to the problem area',
      direct: 'Give a direct hint that clearly identifies the issue'
    };

    const prompt = `
You are helping with a debugging challenge. ${hintPrompts[hintLevel]}.

Challenge: ${challengeDescription}

Current code:
\`\`\`${language}
${userCode}
\`\`\`

Provide a helpful hint that encourages learning. Don't give away the complete solution.
`;

    try {
      const response = await this.makeGroqRequest(prompt, 'hint-generation');
      return response.choices[0]?.message?.content || 'Unable to generate hint';
    } catch (error) {
      console.error('Hint generation failed:', error);
      throw new Error('Failed to generate hint with AI');
    }
  }

  /**
   * Suggest code improvements
   */
  async suggestImprovements(code: string, language: string): Promise<string[]> {
    if (!this.isAvailable()) {
      throw new Error('AI service is not available');
    }

    const prompt = `
Analyze this ${language} code and suggest 3-5 specific improvements for better practices, performance, or readability:

\`\`\`${language}
${code}
\`\`\`

Return suggestions as a numbered list. Focus on practical, actionable improvements.
`;

    try {
      const response = await this.makeGroqRequest(prompt, 'code-improvement');
      const content = response.choices[0]?.message?.content || '';
      
      // Parse numbered list into array
      return content
        .split('\n')
        .filter(line => /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(suggestion => suggestion.length > 0);
    } catch (error) {
      console.error('Code improvement suggestions failed:', error);
      throw new Error('Failed to get improvement suggestions');
    }
  }

  /**
   * Check if code solution is correct
   */
  async validateSolution(
    originalCode: string,
    fixedCode: string,
    expectedBehavior: string,
    language: string
  ): Promise<{ isCorrect: boolean; feedback: string; score: number }> {
    if (!this.isAvailable()) {
      return { isCorrect: false, feedback: 'AI validation not available', score: 0 };
    }

    const prompt = `
Compare these two ${language} code versions and determine if the fix is correct:

Original (buggy) code:
\`\`\`${language}
${originalCode}
\`\`\`

Fixed code:
\`\`\`${language}
${fixedCode}
\`\`\`

Expected behavior: ${expectedBehavior}

Respond with:
1. CORRECT or INCORRECT
2. Brief feedback explaining why
3. Score from 0-100

Format: RESULT|FEEDBACK|SCORE
`;

    try {
      const response = await this.makeGroqRequest(prompt, 'solution-validation');
      const content = response.choices[0]?.message?.content || '';
      
      const parts = content.split('|');
      const isCorrect = parts[0]?.trim().toUpperCase() === 'CORRECT';
      const feedback = parts[1]?.trim() || 'No feedback available';
      const score = parseInt(parts[2]?.trim() || '0', 10);

      return { isCorrect, feedback, score };
    } catch (error) {
      console.error('Solution validation failed:', error);
      return { isCorrect: false, feedback: 'Validation failed', score: 0 };
    }
  }

  /**
   * Build analysis prompt for code review
   */
  private buildAnalysisPrompt(request: AIAnalysisRequest): string {
    return `
You are an expert ${request.language} developer. Analyze this code for potential issues:

${request.context ? `Context: ${request.context}` : ''}
${request.errorMessage ? `Error: ${request.errorMessage}` : ''}

Code:
\`\`\`${request.language}
${request.code}
\`\`\`

Provide analysis in this JSON format:
{
  "explanation": "Clear explanation of any issues found",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "codeExample": "corrected code if applicable",
  "confidence": 85
}
`;
  }

  /**
   * Make request to Groq API
   */
  private async makeGroqRequest(prompt: string, type: string): Promise<GroqResponse> {
    const response = await fetch(`${this.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768', // Groq's fast model
        messages: [
          {
            role: 'system',
            content: 'You are an expert programming instructor and debugger. Provide clear, educational responses that help users learn.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3, // Lower temperature for more consistent responses
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Parse AI analysis response
   */
  private parseAnalysisResponse(response: GroqResponse): AIAnalysisResponse {
    const content = response.choices[0]?.message?.content || '';
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      return {
        explanation: parsed.explanation || 'No explanation provided',
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
        codeExample: parsed.codeExample,
        confidence: parsed.confidence || 50
      };
    } catch {
      // Fallback to text parsing
      return {
        explanation: content,
        suggestions: [],
        confidence: 50
      };
    }
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export types for use in components
export type { AIAnalysisRequest, AIAnalysisResponse };
