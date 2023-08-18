import { defineTokens } from "@pandacss/dev";
import { colors } from "./colors";

export const tokens = defineTokens({
  fontSizes: {
    xs: { value: ".75rem" },
    sm: { value: ".875rem" },
    base: { value: "1rem" },
    lg: { value: "1.125rem" },
    xl: { value: "1.25rem" },
    "2xl": { value: "1.5rem" },
    "3xl": { value: "1.875rem" },
    "4xl": { value: "2.25rem" },
    "5xl": { value: "3rem" },
    "6xl": { value: "4rem" },
  },
  fontWeights: {
    thin: { value: 100 },
    extralight: { value: 200 },
    light: { value: 300 },
    normal: { value: 400 },
    medium: { value: 500 },
    semibold: { value: 600 },
    bold: { value: 700 },
    extrabold: { value: 800 },
    black: { value: 900 },
  },
  fontStyles: {
    normal: { value: "normal" },
    italic: { value: "italic" },
  },
  fonts: {
    noto: { value: "var(--font-noto-sans), sans-serif" },
  },
  colors,
});
