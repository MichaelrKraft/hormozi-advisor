import { NextRequest } from 'next/server';
import { chatStream } from '@/lib/ai/client';
import { LIFE_COACH_SYSTEM_PROMPT } from '@/lib/prompts/lifeCoachSystemPrompt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create streaming response with life coach system prompt
    const stream = await chatStream(messages, LIFE_COACH_SYSTEM_PROMPT);

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
    console.error('Life Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process life chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
