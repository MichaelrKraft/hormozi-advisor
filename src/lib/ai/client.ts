import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
// Uses ANTHROPIC_API_KEY from environment (your Claude Code Max key)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function chat(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Extract text content from response
    const textBlock = response.content.find((block) => block.type === 'text');
    if (textBlock && textBlock.type === 'text') {
      return textBlock.text;
    }

    return 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    console.error('AI chat error:', error);
    throw new Error('Failed to get AI response');
  }
}

// Streaming chat function
export async function chatStream(
  messages: ChatMessage[],
  systemPrompt: string
) {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  return stream;
}

export async function generateDocument(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (textBlock && textBlock.type === 'text') {
      return textBlock.text;
    }

    return '';
  } catch (error) {
    console.error('Document generation error:', error);
    throw new Error('Failed to generate document');
  }
}
