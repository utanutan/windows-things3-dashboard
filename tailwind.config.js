/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          hover: '#357ABD',
          light: '#E8F4FD',
          dark: '#2E5F8D',
        },
        background: {
          main: '#FFFFFF',
          sidebar: '#F7F7F7',
          hover: '#F0F0F0',
          selected: '#E8F4FD',
          overlay: 'rgba(0, 0, 0, 0.3)',
        },
        border: {
          light: '#E5E5E5',
          medium: '#D1D1D1',
          divider: '#EBEBEB',
        },
        text: {
          primary: '#1C1C1E',
          secondary: '#6E6E73',
          tertiary: '#AEAEB2',
          disabled: '#C7C7CC',
        },
        status: {
          success: '#34C759',
          warning: '#FF9500',
          error: '#FF3B30',
          info: '#5AC8FA',
        },
        tag: {
          red: '#FF6B6B',
          orange: '#FFB366',
          yellow: '#FFE066',
          green: '#95E1D3',
          blue: '#83C5F7',
          purple: '#C4B5FD',
          pink: '#FDB5C8',
          gray: '#C7C7CC',
        },
        checkbox: {
          unchecked: '#D1D1D6',
          checked: '#34C759',
        },
      },
      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '15px',
        lg: '17px',
        xl: '22px',
        '2xl': '28px',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        relaxed: '1.75',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        'sidebar': '240px',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        lg: '12px',
        full: '9999px',
      },
      transitionDuration: {
        fast: '100ms',
        DEFAULT: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 12px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 40px rgba(0, 0, 0, 0.15)',
        xl: '0 20px 60px rgba(0, 0, 0, 0.2)',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
