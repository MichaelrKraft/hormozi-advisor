'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CalculatorInputs } from '@/types/calculator';
import { INDUSTRY_PRESETS, INPUT_TOOLTIPS } from '@/lib/calculator/interpretations';
import { useAutoSave, useLoadSaved } from '@/hooks/useAutoSave';

interface CalculatorFormProps {
  onCalculate: (inputs: CalculatorInputs) => void;
  initialInputs?: Partial<CalculatorInputs>;
}

const DEFAULT_INPUTS: CalculatorInputs = {
  averageOrderValue: 0,
  purchaseFrequency: 0,
  customerLifespan: 0,
  grossMarginPercent: 0,
  monthlyMarketingSpend: 0,
  monthlySalesCosts: 0,
  newCustomersPerMonth: 0,
};

const STORAGE_KEY = 'hormozi-calculator-form';

// Validation rules for each field
const VALIDATION_RULES: Record<keyof CalculatorInputs, { min: number; max: number; required: boolean }> = {
  averageOrderValue: { min: 0, max: 1000000, required: true },
  purchaseFrequency: { min: 0, max: 365, required: true },
  customerLifespan: { min: 0, max: 50, required: true },
  grossMarginPercent: { min: 0, max: 100, required: true },
  monthlyMarketingSpend: { min: 0, max: 10000000, required: false },
  monthlySalesCosts: { min: 0, max: 10000000, required: false },
  newCustomersPerMonth: { min: 0, max: 100000, required: true },
};

export default function CalculatorForm({ onCalculate, initialInputs }: CalculatorFormProps) {
  // Load saved form data on mount
  const savedInputs = useLoadSaved<CalculatorInputs>(STORAGE_KEY, DEFAULT_INPUTS);

  const [inputs, setInputs] = useState<CalculatorInputs>({
    ...DEFAULT_INPUTS,
    ...savedInputs,
    ...initialInputs,
  });
  const [selectedPreset, setSelectedPreset] = useState<string>('Custom');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Mark as mounted after first render to avoid hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Stable callback for auto-save indicator
  const handleAutoSave = useCallback(() => {
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 1500);
  }, []);

  // Auto-save form data
  useAutoSave(STORAGE_KEY, inputs, {
    delay: 1000,
    onSave: handleAutoSave,
  });

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = INDUSTRY_PRESETS.find((p) => p.name === presetName);
    if (preset && preset.defaults) {
      setInputs({
        ...DEFAULT_INPUTS,
        ...preset.defaults,
      });
    }
  };

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({
      ...prev,
      [field]: numValue,
    }));
    setSelectedPreset('Custom');
  };

  const handleBlur = (field: keyof CalculatorInputs) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validate a single field
  const getFieldError = (field: keyof CalculatorInputs): string | null => {
    const rules = VALIDATION_RULES[field];
    const value = inputs[field];

    if (rules.required && (!value || value <= 0)) {
      return 'This field is required';
    }
    if (value < rules.min) {
      return `Value must be at least ${rules.min}`;
    }
    if (value > rules.max) {
      return `Value must be less than ${rules.max.toLocaleString()}`;
    }
    if (field === 'grossMarginPercent' && value > 100) {
      return 'Percentage cannot exceed 100%';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(inputs);
  };

  const isValid =
    inputs.averageOrderValue > 0 &&
    inputs.purchaseFrequency > 0 &&
    inputs.customerLifespan > 0 &&
    inputs.grossMarginPercent > 0 &&
    inputs.newCustomersPerMonth > 0;

  // Button is only enabled after mounting (to avoid hydration mismatch) and when form is valid
  const canSubmit = hasMounted && isValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auto-save indicator */}
      {showSaveIndicator && (
        <div className="fixed top-4 right-4 bg-emerald-600/90 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg animate-pulse z-50">
          Progress saved
        </div>
      )}

      {/* Industry Preset Selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Industry Preset
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-sky-500 focus:outline-none"
        >
          {INDUSTRY_PRESETS.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* LTV Inputs Section */}
      <div className="border-t border-zinc-700 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">LTV Metrics</h3>
        <p className="text-sm text-zinc-500 mb-4">
          These determine your Customer Lifetime Value (GROSS PROFIT, not revenue)
        </p>
        <div className="grid gap-4">
          <InputField
            label="Average Order Value"
            field="averageOrderValue"
            value={inputs.averageOrderValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            prefix="$"
            tooltip={INPUT_TOOLTIPS.averageOrderValue}
            error={touched.averageOrderValue ? getFieldError('averageOrderValue') : null}
          />
          <InputField
            label="Purchase Frequency"
            field="purchaseFrequency"
            value={inputs.purchaseFrequency}
            onChange={handleInputChange}
            onBlur={handleBlur}
            suffix="per year"
            tooltip={INPUT_TOOLTIPS.purchaseFrequency}
            error={touched.purchaseFrequency ? getFieldError('purchaseFrequency') : null}
          />
          <InputField
            label="Customer Lifespan"
            field="customerLifespan"
            value={inputs.customerLifespan}
            onChange={handleInputChange}
            onBlur={handleBlur}
            suffix="years"
            tooltip={INPUT_TOOLTIPS.customerLifespan}
            error={touched.customerLifespan ? getFieldError('customerLifespan') : null}
          />
          <InputField
            label="Gross Margin"
            field="grossMarginPercent"
            value={inputs.grossMarginPercent}
            onChange={handleInputChange}
            onBlur={handleBlur}
            suffix="%"
            tooltip={INPUT_TOOLTIPS.grossMarginPercent}
            error={touched.grossMarginPercent ? getFieldError('grossMarginPercent') : null}
          />
        </div>
      </div>

      {/* CAC Inputs Section */}
      <div className="border-t border-zinc-700 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">CAC Metrics</h3>
        <p className="text-sm text-zinc-500 mb-4">
          These determine your Customer Acquisition Cost
        </p>
        <div className="grid gap-4">
          <InputField
            label="Monthly Marketing Spend"
            field="monthlyMarketingSpend"
            value={inputs.monthlyMarketingSpend}
            onChange={handleInputChange}
            onBlur={handleBlur}
            prefix="$"
            tooltip={INPUT_TOOLTIPS.monthlyMarketingSpend}
            error={touched.monthlyMarketingSpend ? getFieldError('monthlyMarketingSpend') : null}
          />
          <InputField
            label="Monthly Sales Costs"
            field="monthlySalesCosts"
            value={inputs.monthlySalesCosts}
            onChange={handleInputChange}
            onBlur={handleBlur}
            prefix="$"
            tooltip={INPUT_TOOLTIPS.monthlySalesCosts}
            error={touched.monthlySalesCosts ? getFieldError('monthlySalesCosts') : null}
          />
          <InputField
            label="New Customers per Month"
            field="newCustomersPerMonth"
            value={inputs.newCustomersPerMonth}
            onChange={handleInputChange}
            onBlur={handleBlur}
            suffix="customers"
            tooltip={INPUT_TOOLTIPS.newCustomersPerMonth}
            error={touched.newCustomersPerMonth ? getFieldError('newCustomersPerMonth') : null}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors ${
          canSubmit
            ? 'bg-sky-600 text-white hover:bg-sky-500 cursor-pointer'
            : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
        }`}
      >
        Calculate My Numbers
      </button>

      {!canSubmit && hasMounted && (
        <p className="text-center text-sm text-zinc-500">
          Fill in all required fields to calculate
        </p>
      )}
    </form>
  );
}

interface InputFieldProps {
  label: string;
  field: keyof CalculatorInputs;
  value: number;
  onChange: (field: keyof CalculatorInputs, value: string) => void;
  onBlur?: (field: keyof CalculatorInputs) => void;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  error?: string | null;
}

function InputField({
  label,
  field,
  value,
  onChange,
  onBlur,
  prefix,
  suffix,
  tooltip,
  error,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-400 mb-1">
        {label}
        {tooltip && (
          <span className="ml-1 text-zinc-600 cursor-help" title={tooltip}>
            ?
          </span>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(field, e.target.value)}
          onBlur={() => onBlur?.(field)}
          placeholder="0"
          step="any"
          min="0"
          className={`w-full py-3 bg-zinc-800 border rounded-lg text-white focus:border-sky-500 focus:outline-none ${
            error ? 'border-red-500' : 'border-zinc-700'
          } ${prefix ? 'pl-8 pr-4' : 'px-4'} ${suffix ? 'pr-20' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
