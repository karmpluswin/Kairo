import { Playfair_Display, Poppins } from 'next/font/google';
import localFont from "next/font/local";

export const playFair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const poppins = Poppins({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export const minecraft = localFont({
  src: "../../public/fonts/Minecraft.ttf",
  variable: "--font-minecraft",
});

export const sukajan = localFont({
  src: "../../public/fonts/SukajanBrushDemoRegular-q2Mmx.otf",
  variable: "--font-sukajan",
});