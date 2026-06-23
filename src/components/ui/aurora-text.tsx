import { cn } from '@/lib/utils';
import { motion, MotionProps } from 'motion/react';
import React from 'react';

interface AuroraTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  readonly className?: string;
  readonly children: React.ReactNode;
  readonly as?: React.ElementType;
}

export function AuroraText({
  className,
  children,
  as: Component = 'span',
  ...props
}: AuroraTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn('aurora-text-wrapper', className)}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}