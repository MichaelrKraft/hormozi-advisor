'use client';

import { useState } from 'react';
import type { CalculatorInputs } from '@/types/calculator';
import { INDUSTRY_PRESETS, INPUT_TOOLTIPS } from '@/lib/calculator/interpretations';

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

export default function CalculatorForm({ onCalculate, initialInputs }: CalculatorFormProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    ...DEFAULT_INPUTS,
    ...initialInputs,
  });
  const [selectedPreset, setSelectedPreset] = useState<string>('Custom');

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Industry Preset Selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Industry Preset
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
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
            prefix="$"
            tooltip={INPUT_TOOLTIPS.averageOrderValue}
          />
          <InputField
            label="Purchase Frequency"
            field="purchaseFrequency"
            value={inputs.purchaseFrequency}
            onChange={handleInputChange}
            suffix="per year"
            tooltip={INPUT_TOOLTIPS.purchaseFrequency}
          />
          <InputField
            label="Customer Lifespan"
            field="customerLifespan"
            value={inputs.customerLifespan}
            onChange={handleInputChange}
            suffix="years"
            tooltip={INPUT_TOOLTIPS.customerLifespan}
          />
          <InputField
            label="Gross Margin"
            field="grossMarginPercent"
            value={inputs.grossMarginPercent}
            onChange={handleInputChange}
            suffix="%"
            tooltip={INPUT_TOOLTIPS.grossMarginPercent}
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
            prefix="$"
            tooltip={INPUT_TOOLTIPS.monthlyMarketingSpend}
          />
          <InputField
            label="Monthly Sales Costs"
            field="monthlySalesCosts"
            value={inputs.monthlySalesCosts}
            onChange={handleInputChange}
            prefix="$"
            tooltip={INPUT_TOOLTIPS.monthlySalesCosts}
          />
          <InputField
            label="New Customers per Month"
            field="newCustomersPerMonth"
            value={inputs.newCustomersPerMonth}
            onChange={handleInputChange}
            suffix="customers"
            tooltip={INPUT_TOOLTIPS.newCustomersPerMonth}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors ${
          isValid
            ? 'bg-amber-600 text-white hover:bg-amber-500 cursor-pointer'
            : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
        }`}
      >
        Calculate My Numbers
      </button>

      {!isValid && (
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
  prefix?: string;
  suffix?: string;
  tooltip?: string;
}

function InputField({
  label,
  field,
  value,
  onChange,
  prefix,
  suffix,
  tooltip,
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
          placeholder="0"
          step="any"
          min="0"
          className={`w-full py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 focus:outline-none ${
            prefix ? 'pl-8 pr-4' : 'px-4'
          } ${suffix ? 'pr-20' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
