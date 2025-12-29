'use client';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className = '',
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${disabled ? 'shiny-text--disabled' : ''} ${className}`}
      style={
        !disabled
          ? {
              '--shine-duration': animationDuration,
            } as React.CSSProperties
          : undefined
      }
    >
      {text}
    </span>
  );
}
