'use client';

import { useState } from 'react';
import type { BottleneckAnswer } from '@/types/bottleneck';
import { BOTTLENECK_QUESTIONS } from '@/lib/bottleneck/questions';

interface BottleneckQuizProps {
  onComplete: (answers: BottleneckAnswer[]) => void;
}

export default function BottleneckQuiz({ onComplete }: BottleneckQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<BottleneckAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = BOTTLENECK_QUESTIONS[currentIndex];
  const totalQuestions = BOTTLENECK_QUESTIONS.length;
  const progress = ((currentIndex) / totalQuestions) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswer: BottleneckAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      // Quiz complete
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Restore previous answer
      const previousAnswer = answers[currentIndex - 1];
      if (previousAnswer) {
        setSelectedOption(previousAnswer.selectedIndex);
        // Remove the last answer since we're going back
        setAnswers(answers.slice(0, -1));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between text-sm text-zinc-400 mb-2">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedOption === index
                  ? 'bg-amber-600/20 border-amber-600 text-white'
                  : 'bg-zinc-700/30 border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === index
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-zinc-500'
                  }`}
                >
                  {selectedOption === index && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span>{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
            selectedOption !== null
              ? 'bg-amber-600 text-white hover:bg-amber-500'
              : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {currentIndex < totalQuestions - 1 ? 'Next Question' : 'See My Results'}
        </button>
      </div>
    </div>
  );
}
