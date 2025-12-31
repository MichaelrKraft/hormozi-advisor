import type { Message } from '@/types';

interface MarkdownExportOptions {
  title: string;
  messages: Message[];
  industry?: string | null;
  createdAt?: number;
}

export function exportConversationAsMarkdown(options: MarkdownExportOptions): void {
  const { title, messages, industry, createdAt } = options;

  // Build markdown content
  let markdown = `# ${title}\n\n`;

  // Add metadata
  const date = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  markdown += `**Date:** ${date}\n`;
  if (industry) {
    markdown += `**Industry:** ${industry}\n`;
  }
  markdown += `\n---\n\n`;

  // Add messages
  messages.forEach((message) => {
    const role = message.role === 'user' ? 'You' : 'Hormozi Advisor';
    const timestamp = message.timestamp
      ? new Date(message.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    markdown += `### ${role}${timestamp ? ` (${timestamp})` : ''}\n\n`;
    markdown += `${message.content}\n\n`;
    markdown += `---\n\n`;
  });

  // Add footer
  markdown += `\n*Exported from Hormozi Advisor | Based on $100M Offers & $100M Leads by Alex Hormozi*\n`;

  // Create and download the file
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  // Generate filename from title
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}.md`;

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
