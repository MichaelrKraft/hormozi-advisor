import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Simple HTML to text extraction
function extractText(html: string): string {
  // Remove scripts, styles, and other non-content elements
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Replace common elements with spacing
  text = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  // Clean up whitespace
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  return text;
}

// Extract internal links from HTML
function extractInternalLinks(html: string, baseOrigin: string): string[] {
  const linkRegex = /href=["']([^"']+)["']/gi;
  const links: Set<string> = new Set();
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    // Skip anchors, external links, assets
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (href.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|pdf|zip)$/i)) continue;

    try {
      const fullUrl = href.startsWith('http') ? href : new URL(href, baseOrigin).href;
      if (fullUrl.startsWith(baseOrigin)) {
        links.add(fullUrl);
      }
    } catch {
      // Invalid URL, skip
    }
  }

  return Array.from(links);
}

// Fetch multiple pages from a website with intelligent discovery
async function crawlWebsite(baseUrl: string): Promise<string> {
  const url = new URL(baseUrl);

  // Priority pages to crawl (common important pages)
  const priorityPaths = [
    '', // homepage
    '/about', '/about-us',
    '/features', '/how-it-works', '/how-it-works/',
    '/services', '/solutions',
    '/products', '/product',
    '/pricing', '/plans',
    '/faq', '/faqs', '/help',
    '/docs', '/documentation',
    '/demo', '/tour',
    '/use-cases', '/examples',
    '/for-agencies', '/for-businesses', '/for-teams',
  ];

  const pagesToFetch = new Set(priorityPaths.map(p => `${url.origin}${p}`));
  const fetchedUrls = new Set<string>();
  const results: string[] = [];

  // First, fetch the homepage and discover more links
  try {
    const homepageResponse = await fetch(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HormoziAdvisor/1.0; +https://hormoziadvisor.com)',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (homepageResponse.ok) {
      const html = await homepageResponse.text();
      const text = extractText(html);
      if (text.length > 100) {
        results.push(`=== HOMEPAGE: ${baseUrl} ===\n${text.slice(0, 8000)}`);
        fetchedUrls.add(baseUrl);
      }

      // Discover more internal links
      const discoveredLinks = extractInternalLinks(html, url.origin);
      discoveredLinks.forEach(link => pagesToFetch.add(link));
    }
  } catch {
    // Homepage failed, continue with priority pages
  }

  // Fetch remaining pages (limit to avoid timeout)
  const remainingPages = Array.from(pagesToFetch)
    .filter(p => !fetchedUrls.has(p))
    .slice(0, 15); // Max 15 additional pages

  await Promise.all(
    remainingPages.map(async (pageUrl) => {
      try {
        const response = await fetch(pageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; HormoziAdvisor/1.0; +https://hormoziadvisor.com)',
          },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const html = await response.text();
          const text = extractText(html);
          if (text.length > 100) {
            const pageName = new URL(pageUrl).pathname || '/';
            results.push(`=== PAGE: ${pageName} ===\n${text.slice(0, 6000)}`);
          }
        }
      } catch {
        // Skip failed pages silently
      }
    })
  );

  return results.join('\n\n').slice(0, 50000); // Increased limit for more context
}

// Use Claude to analyze and structure the business info
async function analyzeBusinessContent(content: string, url: string): Promise<object> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: `You are analyzing a business website to help a business advisor give specific, actionable advice. Extract as much operational detail as possible.

Website: ${url}

Content from multiple pages:
${content}

Return a comprehensive JSON object with these fields (use null if not found, be as detailed as possible):

{
  "businessName": "Name of the business",
  "industry": "Primary industry/niche (be specific, e.g., 'AI Copywriting SaaS' not just 'SaaS')",
  "tagline": "Main value proposition or tagline",

  "products": [
    {
      "name": "Product/service name",
      "description": "What it does",
      "keyFeatures": ["List of features"]
    }
  ],

  "howItWorks": "Step-by-step explanation of how the main product works from user's perspective. What does a user do from signup to getting value?",

  "targetAudience": "Detailed description of who they serve - job titles, company sizes, pain points",

  "uniqueValue": "What specifically makes them different from competitors? What's their unfair advantage?",

  "pricing": {
    "model": "freemium/subscription/one-time/usage-based/etc",
    "tiers": "List of pricing tiers if available",
    "prices": "Actual prices if shown"
  },

  "businessModel": "How they make money - detailed explanation",

  "keyBenefits": ["Top 3-5 benefits they promise to customers"],

  "socialProof": "Any testimonials, case studies, customer logos, or results mentioned",

  "currentOffer": "Any special offers, free trials, guarantees mentioned",

  "potentialWeaknesses": "Based on the website, what might be weak in their positioning, messaging, or offer?",

  "competitivePosition": "Who are they positioning against? How do they differentiate?",

  "summary": "3-4 sentence summary that a business advisor could use to understand this business and give relevant advice"
}

Return ONLY the JSON object, no other text. Be thorough - this analysis will be used to give specific business advice.`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    return JSON.parse(text);
  } catch {
    return {
      businessName: null,
      industry: null,
      summary: text.slice(0, 500),
      error: 'Could not parse structured data',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Crawl the website
    const content = await crawlWebsite(parsedUrl.href);

    if (!content || content.length < 100) {
      return NextResponse.json(
        { error: 'Could not extract content from website' },
        { status: 400 }
      );
    }

    // Analyze with Claude
    const businessInfo = await analyzeBusinessContent(content, parsedUrl.href);

    return NextResponse.json({
      success: true,
      url: parsedUrl.href,
      businessInfo,
      rawContentLength: content.length,
    });
  } catch (error) {
    console.error('Crawl error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    );
  }
}
