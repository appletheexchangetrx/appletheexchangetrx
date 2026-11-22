import React from 'react';
import { Phone } from 'lucide-react';
import { stripMalaysiaPhonePrefix } from '../../utils/storage';

interface PhoneInputProps {
  value: string;
  onChange: (localValue: string) => void;
  placeholder?: string;
  autoComplete?: string;
  showIcon?: boolean;
  compact?: boolean;
  ariaLabel?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = '12-345 6789',
  autoComplete = 'tel-national',
  showIcon = false,
  compact = false,
  ariaLabel = 'Phone number',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = stripMalaysiaPhonePrefix(e.target.value);
    onChange(stripped);
  };

  return (
    <div
      className={`flex items-center overflow-hidden bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] focus-within:border-[#0071E3] dark:focus-within:border-[#2997FF] transition-colors ${
        compact ? 'h-[44px] rounded-[10px]' : 'h-[48px] rounded-[12px]'
      }`}
    >
      <div
        className={`flex items-center gap-1.5 h-full border-r border-[#D2D2D7] dark:border-[#38383A] shrink-0 select-none ${
          compact ? 'px-2.5' : 'px-3'
        }`}
      >
        {showIcon && <Phone className="w-4 h-4 text-[#86868B] shrink-0" />}
        <span className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
          +60
        </span>
      </div>

      <input
        type="tel"
        inputMode="tel"
        aria-label={ariaLabel}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`flex-1 min-w-0 h-full bg-transparent text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#86868B] focus:outline-none tabular-nums ${
          compact ? 'px-2.5' : 'px-3'
        }`}
      />
    </div>
  );
};
