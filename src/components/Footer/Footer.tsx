'use client';

import { FluidGradientText } from '@/components/fluid-gradient-text';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border/40">
      <div className="h-[120px] w-full sm:h-[150px] md:h-[180px] lg:h-[200px] text-foreground">
        <FluidGradientText text="Kairo" svgViewBoxWidth={1600} svgViewBoxHeight={400} />
      </div>
    </footer>
  );
};

export default Footer;