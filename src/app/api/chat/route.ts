import { NextRequest } from 'next/server';
import { chatStream } from '@/lib/ai/client';
import { HORMOZI_SYSTEM_PROMPT } from '@/lib/prompts/chatSystemPrompt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, industry } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add industry context to system prompt if provided
    let systemPrompt = HORMOZI_SYSTEM_PROMPT;
    if (industry) {
      systemPrompt = `${HORMOZI_SYSTEM_PROMPT}\n\nIMPORTANT CONTEXT: The user is in the "${industry}" industry/niche. Tailor all advice, examples, and recommendations specifically for this industry. Use relevant industry terminology and reference successful businesses in this space when giving examples. When I built Gym Launch, I learned every industry has its own nuances - yours is no different.`;
    }

    // Create streaming response
    const stream = await chatStream(messages, systemPrompt);

    // Create a TransformStream to convert the Anthropic stream to a ReadableStream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
