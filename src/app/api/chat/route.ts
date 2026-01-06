import { NextRequest } from 'next/server';
import { chatStream } from '@/lib/ai/client';
import { HORMOZI_SYSTEM_PROMPT } from '@/lib/prompts/chatSystemPrompt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, industry, websiteContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build system prompt with context
    let systemPrompt = HORMOZI_SYSTEM_PROMPT;

    // Add industry context
    if (industry) {
      systemPrompt = `${systemPrompt}\n\nIMPORTANT CONTEXT: The user is in the "${industry}" industry/niche. Tailor all advice, examples, and recommendations specifically for this industry. Use relevant industry terminology and reference successful businesses in this space when giving examples. When I built Gym Launch, I learned every industry has its own nuances - yours is no different.`;
    }

    // Add website/business context if provided
    if (websiteContext) {
      const ctx = websiteContext;

      // Format products if they're in the new detailed format
      let productsInfo = 'Not specified';
      if (ctx.products) {
        if (Array.isArray(ctx.products) && ctx.products.length > 0) {
          if (typeof ctx.products[0] === 'object') {
            // New detailed format
            productsInfo = ctx.products.map((p: { name?: string; description?: string; keyFeatures?: string[] }) =>
              `- ${p.name}: ${p.description}${p.keyFeatures ? ` (Features: ${p.keyFeatures.join(', ')})` : ''}`
            ).join('\n');
          } else {
            // Old simple format
            productsInfo = ctx.products.join(', ');
          }
        }
      }

      // Format pricing if it's in the new detailed format
      let pricingInfo = 'Not specified';
      if (ctx.pricing) {
        if (typeof ctx.pricing === 'object') {
          const p = ctx.pricing as { model?: string; tiers?: string; prices?: string };
          pricingInfo = `Model: ${p.model || 'Unknown'}, Tiers: ${p.tiers || 'Unknown'}, Prices: ${p.prices || 'Unknown'}`;
        } else {
          pricingInfo = ctx.pricing;
        }
      }

      systemPrompt = `${systemPrompt}\n\n=== USER'S BUSINESS CONTEXT (ANALYZED FROM THEIR WEBSITE) ===
You have deep knowledge about the user's business from analyzing their website. Use this to give SPECIFIC, ACTIONABLE advice.

**BUSINESS OVERVIEW**
Business Name: ${ctx.businessName || 'Unknown'}
Industry: ${ctx.industry || 'Unknown'}
Tagline: ${ctx.tagline || 'Not specified'}
Summary: ${ctx.summary || 'Not available'}

**PRODUCTS/SERVICES**
${productsInfo}

**HOW IT WORKS**
${ctx.howItWorks || 'Not specified'}

**TARGET AUDIENCE**
${ctx.targetAudience || 'Not specified'}

**UNIQUE VALUE PROPOSITION**
${ctx.uniqueValue || 'Not specified'}

**PRICING**
${pricingInfo}

**BUSINESS MODEL**
${ctx.businessModel || 'Not specified'}

**KEY BENEFITS PROMISED**
${ctx.keyBenefits ? (Array.isArray(ctx.keyBenefits) ? ctx.keyBenefits.join(', ') : ctx.keyBenefits) : 'Not specified'}

**SOCIAL PROOF**
${ctx.socialProof || 'Not specified'}

**CURRENT OFFERS**
${ctx.currentOffer || 'Not specified'}

**POTENTIAL WEAKNESSES (for improvement)**
${ctx.potentialWeaknesses || 'Not analyzed'}

**COMPETITIVE POSITIONING**
${ctx.competitivePosition || 'Not specified'}

${ctx.additionalContext ? `**ADDITIONAL CONTEXT FROM USER**\n${ctx.additionalContext}` : ''}

CRITICAL INSTRUCTIONS:
1. Reference their SPECIFIC products, features, and pricing when giving advice
2. Frame all strategies using THEIR target audience and unique value
3. Don't give generic advice - make it specific to THIS business
4. When suggesting offers, use their actual product names and features
5. Point out specific improvements they could make based on the weaknesses identified
6. If they haven't shared certain info (like metrics), ask for it - but give advice based on what you DO know
=== END BUSINESS CONTEXT ===`;
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
