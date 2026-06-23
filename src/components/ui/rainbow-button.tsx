import React from 'react';
import { cn } from '@/lib/utils';

type RainbowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const RainbowButton = React.forwardRef<
  HTMLButtonElement,
  RainbowButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn('rainbow-btn', className)}
      {...props}
    >
      {children}
    </button>
  );
});

RainbowButton.displayName = 'RainbowButton';