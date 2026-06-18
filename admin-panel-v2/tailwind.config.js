/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        surface: '#FFFFFF',
        background: '#F8FAFC',
        alt: '#F1F5F9',
        border: '#E2E8F0',
        heading: '#0F172A',
        body: '#334155',
        muted: '#64748B',
        highlight: '#14B8A6',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.35s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};




// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: 'class',
//   content: [
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
//         mono: ['var(--font-geist-mono)', 'monospace'],
//       },
//       colors: {
//         brand: {
//           50:  '#f0f4ff',
//           100: '#e0eaff',
//           500: '#4361ee',
//           600: '#3451d1',
//           700: '#2a3fb5',
//         },
//       },
//       animation: {
//         'fade-in': 'fadeIn 0.4s ease forwards',
//         'slide-up': 'slideUp 0.35s ease forwards',
//       },
//       keyframes: {
//         fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
//         slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
//       },
//     },
//   },
//   plugins: [],
// };
