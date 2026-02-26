// tailwind.config.js
import daisyui from 'daisyui';

export default {
  plugins: [daisyui],
  daisyui: {
    themes: ["corporate"], // Force only corporate theme (light)
    darkTheme: false, // Disable dark theme
    base: true,
    styled: true,
    utils: true,
  },
};
