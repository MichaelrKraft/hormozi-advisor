import type {
  BottleneckArea,
  BottleneckAnswer,
  BottleneckResults,
} from '@/types/bottleneck';
import { BOTTLENECK_QUESTIONS } from './questions';

/**
 * Calculate bottleneck results from answers
 */
export function calculateBottleneckResults(
  answers: BottleneckAnswer[]
): BottleneckResults {
  // Initialize scores
  const scores: Record<BottleneckArea, number> = {
    leads: 0,
    conversion: 0,
    pricing: 0,
    retention: 0,
  };

  // Sum up scores from all answers
  for (const answer of answers) {
    const question = BOTTLENECK_QUESTIONS.find((q) => q.id === answer.questionId);
    if (question && question.options[answer.selectedIndex]) {
      const option = question.options[answer.selectedIndex];
      scores.leads += option.scores.leads;
      scores.conversion += option.scores.conversion;
      scores.pricing += option.scores.pricing;
      scores.retention += option.scores.retention;
    }
  }

  // Calculate total for percentages
  const total = scores.leads + scores.conversion + scores.pricing + scores.retention;

  // Calculate percentages
  const percentages: Record<BottleneckArea, number> = {
    leads: total > 0 ? Math.round((scores.leads / total) * 100) : 25,
    conversion: total > 0 ? Math.round((scores.conversion / total) * 100) : 25,
    pricing: total > 0 ? Math.round((scores.pricing / total) * 100) : 25,
    retention: total > 0 ? Math.round((scores.retention / total) * 100) : 25,
  };

  // Find primary and secondary bottlenecks
  const sortedAreas = (Object.entries(scores) as [BottleneckArea, number][])
    .sort((a, b) => b[1] - a[1]);

  const primary = sortedAreas[0][0];
  const secondary = sortedAreas[1][0];

  return {
    primary,
    secondary,
    scores,
    percentages,
  };
}

/**
 * Get severity level based on percentage
 */
export function getSeverity(percentage: number): {
  level: 'critical' | 'significant' | 'moderate' | 'minor';
  label: string;
} {
  if (percentage >= 40) {
    return { level: 'critical', label: 'Critical' };
  }
  if (percentage >= 30) {
    return { level: 'significant', label: 'Significant' };
  }
  if (percentage >= 20) {
    return { level: 'moderate', label: 'Moderate' };
  }
  return { level: 'minor', label: 'Minor' };
}

/**
 * Generate a summary statement based on results
 */
export function generateSummary(results: BottleneckResults): string {
  const severity = getSeverity(results.percentages[results.primary]);

  if (severity.level === 'critical') {
    return `Your business has a clear ${results.primary} bottleneck that needs immediate attention.`;
  }

  if (severity.level === 'significant') {
    return `${results.primary.charAt(0).toUpperCase() + results.primary.slice(1)} is your primary constraint, with ${results.secondary} as a secondary issue.`;
  }

  return `Your business has multiple areas for improvement. Focus on ${results.primary} first, then ${results.secondary}.`;
}
