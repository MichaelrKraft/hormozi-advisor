'use client';

import { useState } from 'react';

type PlaybookType = 'brand' | 'content';

interface WizardStep {
  id: string;
  label: string;
  placeholder: string;
  helpText?: string;
}

const BRAND_STEPS: WizardStep[] = [
  {
    id: 'brandName',
    label: 'What is your brand/business name?',
    placeholder: 'e.g., Acme Creative Studio',
  },
  {
    id: 'desiredOutcome',
    label: 'What is your desired outcome? (Brand Journey Q1)',
    placeholder: 'What do you ultimately want to achieve with your brand?',
    helpText: 'Think big picture - where do you want to be in 3-5 years?',
  },
  {
    id: 'knownFor',
    label: 'What do you want to be known for? (Brand Journey Q2)',
    placeholder: 'What expertise or value should be associated with your name?',
    helpText: 'What should people think when they hear your brand?',
  },
  {
    id: 'needToDo',
    label: 'What do you need to do? (Brand Journey Q3)',
    placeholder: 'What actions will get you from where you are to your desired outcome?',
    helpText: 'List the key activities, content, or products you need to create.',
  },
  {
    id: 'needToLearn',
    label: 'What do you need to learn? (Brand Journey Q4)',
    placeholder: 'What skills or knowledge gaps need filling?',
    helpText: 'What should you study or practice to achieve your goals?',
  },
  {
    id: 'positiveAssociations',
    label: 'What do you WANT to be associated with?',
    placeholder: 'e.g., innovation, quality, approachability, expertise, reliability',
    helpText: 'List qualities, values, or concepts you want linked to your brand.',
  },
  {
    id: 'negativeAssociations',
    label: 'What do you want to AVOID being associated with?',
    placeholder: 'e.g., cheap, outdated, corporate, generic, complicated',
    helpText: 'List things that would hurt your brand if associated.',
  },
  {
    id: 'catalyst',
    label: 'What was your catalyst? (Brand Story)',
    placeholder: 'What moment or event started your journey?',
    helpText: 'The problem you experienced or witnessed that started everything.',
  },
  {
    id: 'coreTruth',
    label: 'What is your core truth? (Brand Story)',
    placeholder: 'What insight or belief did you discover that drives you?',
    helpText: 'The truth you learned that others might not know.',
  },
  {
    id: 'proof',
    label: 'What is your proof? (Brand Story)',
    placeholder: 'What results or evidence validate your approach?',
    helpText: 'Results you or others have achieved that prove your truth works.',
  },
];

const CONTENT_STEPS: WizardStep[] = [
  {
    id: 'brandName',
    label: 'What is your brand/creator name?',
    placeholder: 'e.g., Acme Creative Studio',
  },
  {
    id: 'primaryMedium',
    label: 'What is your primary content medium?',
    placeholder: 'Written, Video, Audio, or Visual/Graphic',
    helpText: 'Choose the format that feels most natural to you.',
  },
  {
    id: 'mediumReason',
    label: 'Why did you choose this medium?',
    placeholder: 'e.g., I enjoy writing and my audience prefers reading articles...',
  },
  {
    id: 'platforms',
    label: 'Which 2-3 platforms will you focus on?',
    placeholder: 'e.g., LinkedIn, Twitter, YouTube',
    helpText: 'Pick 2-3 maximum to master before expanding.',
  },
  {
    id: 'targetAudience',
    label: 'Who is your target audience?',
    placeholder: 'e.g., Early-stage startup founders who struggle with marketing...',
  },
  {
    id: 'currentPosting',
    label: 'How often are you currently posting?',
    placeholder: 'e.g., 2-3 times per week on LinkedIn, daily on Twitter...',
    helpText: 'Be honest - this helps us find a sustainable cadence.',
  },
  {
    id: 'contentGoals',
    label: 'What are your content goals?',
    placeholder: 'e.g., Build thought leadership, generate leads, grow audience...',
  },
  {
    id: 'contentThemes',
    label: 'What are your main content themes/topics?',
    placeholder: 'e.g., Marketing strategy, brand building, startup growth...',
    helpText: 'List 3-5 core topics you want to be known for.',
  },
  {
    id: 'timeAvailable',
    label: 'How much time can you dedicate to content creation weekly?',
    placeholder: 'e.g., 5 hours per week, spread across weekday mornings...',
    helpText: 'Be realistic - consistency beats quantity.',
  },
];

interface PlaybookWizardProps {
  type: PlaybookType;
  onGenerate: (data: Record<string, string>) => void;
  isGenerating: boolean;
}

export default function PlaybookWizard({
  type,
  onGenerate,
  isGenerating,
}: PlaybookWizardProps) {
  const steps = type === 'brand' ? BRAND_STEPS : CONTENT_STEPS;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (value: string) => {
    setAnswers({
      ...answers,
      [steps[currentStep].id]: value,
    });
  };

  const handleGenerate = () => {
    onGenerate(answers);
  };

  const currentAnswer = answers[steps[currentStep].id] || '';
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <label className="block text-xl font-semibold text-gray-900 mb-2">
          {steps[currentStep].label}
        </label>
        {steps[currentStep].helpText && (
          <p className="text-sm text-gray-500 mb-4">
            {steps[currentStep].helpText}
          </p>
        )}
        <textarea
          value={currentAnswer}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={steps[currentStep].placeholder}
          className="w-full h-32 p-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          disabled={isGenerating}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isGenerating}
          className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>

        {isLastStep ? (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              'Generate Playbook'
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={isGenerating}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        )}
      </div>

      {/* Quick Fill (optional) */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          You can also skip ahead and generate with partial answers.
        </p>
        {!isLastStep && (
          <button
            onClick={() => setCurrentStep(steps.length - 1)}
            className="text-sm text-blue-600 hover:underline mt-1"
            disabled={isGenerating}
          >
            Skip to generate
          </button>
        )}
      </div>
    </div>
  );
}
