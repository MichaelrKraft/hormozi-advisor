'use client';

import { useState } from 'react';
import type {
  OfferStack,
  Bonus,
  BonusType,
  GuaranteeType,
  ScarcityType,
  UrgencyType,
} from '@/types/offer-stack';
import { BONUS_TYPES, GUARANTEE_TYPES } from '@/types/offer-stack';
import { generateBonusId } from '@/lib/offer-stack/analysis';

interface OfferStackBuilderProps {
  stack: OfferStack;
  onUpdate: (stack: OfferStack) => void;
}

export default function OfferStackBuilder({ stack, onUpdate }: OfferStackBuilderProps) {
  const [expandedSection, setExpandedSection] = useState<string>('core');

  const updateStack = (updates: Partial<OfferStack>) => {
    onUpdate({ ...stack, ...updates });
  };

  const updateCore = (updates: Partial<OfferStack['coreDeliverable']>) => {
    onUpdate({
      ...stack,
      coreDeliverable: { ...stack.coreDeliverable, ...updates },
    });
  };

  const updateGuarantee = (updates: Partial<OfferStack['guarantee']>) => {
    onUpdate({
      ...stack,
      guarantee: { ...stack.guarantee, ...updates },
    });
  };

  const updateScarcity = (updates: Partial<OfferStack['scarcity']>) => {
    onUpdate({
      ...stack,
      scarcity: { ...stack.scarcity, ...updates },
    });
  };

  const updateUrgency = (updates: Partial<OfferStack['urgency']>) => {
    onUpdate({
      ...stack,
      urgency: { ...stack.urgency, ...updates },
    });
  };

  const addBonus = () => {
    const newBonus: Bonus = {
      id: generateBonusId(),
      title: '',
      description: '',
      value: 0,
      type: 'other',
    };
    onUpdate({ ...stack, bonuses: [...stack.bonuses, newBonus] });
  };

  const updateBonus = (id: string, updates: Partial<Bonus>) => {
    const updatedBonuses = stack.bonuses.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    );
    onUpdate({ ...stack, bonuses: updatedBonuses });
  };

  const removeBonus = (id: string) => {
    onUpdate({ ...stack, bonuses: stack.bonuses.filter((b) => b.id !== id) });
  };

  const Section = ({
    id,
    title,
    icon,
    children,
    complete,
  }: {
    id: string;
    title: string;
    icon: string;
    children: React.ReactNode;
    complete?: boolean;
  }) => {
    const isExpanded = expandedSection === id;

    return (
      <div className="border border-zinc-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setExpandedSection(isExpanded ? '' : id)}
          className="w-full flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold text-white">{title}</span>
            {complete && (
              <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded">
                ✓
              </span>
            )}
          </div>
          <span className="text-zinc-400">{isExpanded ? '−' : '+'}</span>
        </button>
        {isExpanded && <div className="p-4 bg-zinc-800/50 space-y-4">{children}</div>}
      </div>
    );
  };

  const Input = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    prefix,
  }: {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    prefix?: string;
  }) => (
    <div>
      <label className="block text-sm text-zinc-400 mb-1">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-600 ${
            prefix ? 'pl-7' : ''
          }`}
        />
      </div>
    </div>
  );

  const TextArea = ({
    label,
    value,
    onChange,
    placeholder,
    rows = 2,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
  }) => (
    <div>
      <label className="block text-sm text-zinc-400 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-600 resize-none"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Offer Name & Price */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Offer Name"
            value={stack.name}
            onChange={(v) => updateStack({ name: v })}
            placeholder="e.g., 12-Week Transformation"
          />
          <Input
            label="Target Price"
            value={stack.targetPrice || ''}
            onChange={(v) => updateStack({ targetPrice: parseInt(v) || 0 })}
            placeholder="997"
            type="number"
            prefix="$"
          />
        </div>
      </div>

      {/* Core Deliverable */}
      <Section
        id="core"
        title="Core Deliverable"
        icon="🎯"
        complete={!!stack.coreDeliverable.title && stack.coreDeliverable.value > 0}
      >
        <p className="text-sm text-zinc-500 mb-4">
          The main thing you&apos;re selling. What do they get?
        </p>
        <div className="space-y-4">
          <Input
            label="What is it?"
            value={stack.coreDeliverable.title}
            onChange={(v) => updateCore({ title: v })}
            placeholder="e.g., 12-Week Business Coaching Program"
          />
          <TextArea
            label="Description"
            value={stack.coreDeliverable.description}
            onChange={(v) => updateCore({ description: v })}
            placeholder="What's included? What transformation do they get?"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Delivery Method"
              value={stack.coreDeliverable.deliveryMethod}
              onChange={(v) => updateCore({ deliveryMethod: v })}
              placeholder="e.g., Live calls + video library"
            />
            <Input
              label="Timeline"
              value={stack.coreDeliverable.timeline}
              onChange={(v) => updateCore({ timeline: v })}
              placeholder="e.g., 12 weeks"
            />
          </div>
          <Input
            label="If sold separately, what would this be worth?"
            value={stack.coreDeliverable.value || ''}
            onChange={(v) => updateCore({ value: parseInt(v) || 0 })}
            placeholder="5000"
            type="number"
            prefix="$"
          />
        </div>
      </Section>

      {/* Bonuses */}
      <Section
        id="bonuses"
        title={`Bonuses (${stack.bonuses.length})`}
        icon="🎁"
        complete={stack.bonuses.length >= 2}
      >
        <p className="text-sm text-zinc-500 mb-4">
          Stack value by adding bonuses that address objections and increase desire.
        </p>

        {stack.bonuses.map((bonus, index) => (
          <div
            key={bonus.id}
            className="bg-zinc-700/30 border border-zinc-600 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm text-zinc-400">Bonus #{index + 1}</span>
              <button
                onClick={() => removeBonus(bonus.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
            <Input
              label="Bonus Name"
              value={bonus.title}
              onChange={(v) => updateBonus(bonus.id, { title: v })}
              placeholder="e.g., Done-For-You Templates"
            />
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Type</label>
              <select
                value={bonus.type}
                onChange={(e) =>
                  updateBonus(bonus.id, { type: e.target.value as BonusType })
                }
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-amber-600"
              >
                {Object.entries(BONUS_TYPES).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.icon} {meta.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500 mt-1">
                {BONUS_TYPES[bonus.type].examples}
              </p>
            </div>
            <TextArea
              label="Description"
              value={bonus.description}
              onChange={(v) => updateBonus(bonus.id, { description: v })}
              placeholder="What do they get and how does it help?"
              rows={2}
            />
            <Input
              label="Value (if sold separately)"
              value={bonus.value || ''}
              onChange={(v) => updateBonus(bonus.id, { value: parseInt(v) || 0 })}
              placeholder="500"
              type="number"
              prefix="$"
            />
          </div>
        ))}

        <button
          onClick={addBonus}
          className="w-full py-2 px-4 border border-dashed border-zinc-600 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
        >
          + Add Bonus
        </button>
      </Section>

      {/* Guarantee */}
      <Section
        id="guarantee"
        title="Guarantee"
        icon="🛡️"
        complete={stack.guarantee.type !== 'none'}
      >
        <p className="text-sm text-zinc-500 mb-4">
          Risk reversal is one of the most powerful conversion levers.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Guarantee Type</label>
            <div className="space-y-2">
              {Object.entries(GUARANTEE_TYPES).map(([key, meta]) => (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    stack.guarantee.type === key
                      ? 'bg-amber-900/20 border-amber-600'
                      : 'bg-zinc-700/30 border-zinc-600 hover:border-zinc-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="guarantee"
                    value={key}
                    checked={stack.guarantee.type === key}
                    onChange={() => updateGuarantee({ type: key as GuaranteeType })}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-white font-medium">{meta.label}</div>
                    <div className="text-sm text-zinc-400">{meta.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {stack.guarantee.type !== 'none' && (
            <>
              <Input
                label="Duration"
                value={stack.guarantee.duration}
                onChange={(v) => updateGuarantee({ duration: v })}
                placeholder="e.g., 30 days, 90 days, lifetime"
              />
              {stack.guarantee.type === 'conditional' && (
                <TextArea
                  label="Conditions"
                  value={stack.guarantee.conditions}
                  onChange={(v) => updateGuarantee({ conditions: v })}
                  placeholder="What must they do to qualify for the guarantee?"
                />
              )}
              <TextArea
                label="How you'll phrase it"
                value={stack.guarantee.customText}
                onChange={(v) => updateGuarantee({ customText: v })}
                placeholder="e.g., If you don't 2x your leads in 90 days, we'll refund every penny..."
              />
            </>
          )}
        </div>
      </Section>

      {/* Scarcity */}
      <Section
        id="scarcity"
        title="Scarcity"
        icon="⏳"
        complete={stack.scarcity.type !== 'none'}
      >
        <p className="text-sm text-zinc-500 mb-4">
          Why can&apos;t everyone get this? Real scarcity creates real urgency.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Scarcity Type</label>
            <select
              value={stack.scarcity.type}
              onChange={(e) =>
                updateScarcity({ type: e.target.value as ScarcityType })
              }
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-amber-600"
            >
              <option value="none">No Scarcity</option>
              <option value="spots">Limited Spots</option>
              <option value="inventory">Limited Inventory</option>
              <option value="time-investment">Time/Capacity Constraint</option>
              <option value="capacity">Team/Resource Capacity</option>
            </select>
          </div>
          {stack.scarcity.type !== 'none' && (
            <>
              <Input
                label="Specific Limit"
                value={stack.scarcity.limit}
                onChange={(v) => updateScarcity({ limit: v })}
                placeholder="e.g., Only 10 spots, 50 units available"
              />
              <TextArea
                label="Why is there a limit? (The real reason)"
                value={stack.scarcity.reason}
                onChange={(v) => updateScarcity({ reason: v })}
                placeholder="e.g., I can only handle 10 clients at once to maintain quality..."
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stack.scarcity.isReal}
                  onChange={(e) => updateScarcity({ isReal: e.target.checked })}
                  className="rounded bg-zinc-700 border-zinc-600"
                />
                <span className="text-sm text-zinc-300">
                  This is real scarcity (not artificial)
                </span>
              </label>
            </>
          )}
        </div>
      </Section>

      {/* Urgency */}
      <Section
        id="urgency"
        title="Urgency"
        icon="⚡"
        complete={stack.urgency.type !== 'none'}
      >
        <p className="text-sm text-zinc-500 mb-4">
          Why should they act NOW instead of later?
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Urgency Type</label>
            <select
              value={stack.urgency.type}
              onChange={(e) =>
                updateUrgency({ type: e.target.value as UrgencyType })
              }
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-amber-600"
            >
              <option value="none">No Urgency</option>
              <option value="price-increase">Price Increases</option>
              <option value="bonus-removal">Bonus Goes Away</option>
              <option value="enrollment-close">Enrollment Closes</option>
              <option value="event-based">Event-Based Deadline</option>
            </select>
          </div>
          {stack.urgency.type !== 'none' && (
            <>
              <Input
                label="Deadline"
                value={stack.urgency.deadline}
                onChange={(v) => updateUrgency({ deadline: v })}
                placeholder="e.g., Friday at midnight, End of the month"
              />
              <Input
                label="What happens if they wait?"
                value={stack.urgency.consequence}
                onChange={(v) => updateUrgency({ consequence: v })}
                placeholder="e.g., Price goes up $500, Free coaching call removed"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stack.urgency.isReal}
                  onChange={(e) => updateUrgency({ isReal: e.target.checked })}
                  className="rounded bg-zinc-700 border-zinc-600"
                />
                <span className="text-sm text-zinc-300">
                  This deadline is real (you&apos;ll actually enforce it)
                </span>
              </label>
            </>
          )}
        </div>
      </Section>
    </div>
  );
}
