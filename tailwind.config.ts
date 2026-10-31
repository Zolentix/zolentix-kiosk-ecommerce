import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        kiosk: {
          bg: '#0A0A0F',
          surface: '#13131C',
          'surface-hover': '#1A1A26',
          'surface-raised': '#1E1E2E',
          border: '#2A2A3C',
          primary: '#6D4AFF',
          'primary-light': '#8B5CF6',
          accent: '#22D3EE',
          text: '#EDEDF2',
          'text-muted': '#9CA3AF',
          'text-dim': '#6B7280',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
        'gradient-accent': 'linear-gradient(135deg, #6D4AFF, #22D3EE)',
      },
    },
  },
  plugins: [],
}

export default config
