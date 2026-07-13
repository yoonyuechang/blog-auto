export const tokens = {
  color: {
    primary: { 400: '#34D399', 500: '#10B981', 600: '#059669', 900: '#064E3B', 950: '#022C22' },
    secondary: { 400: '#22D3EE', 500: '#06B6D4' },
    neutral: { 50: '#F8FAFC', 400: '#94A3B8', 500: '#64748B', 700: '#334155', 800: '#1E293B', 950: '#0B0F19' },
    semantic: { success: '#34D399', warning: '#FBBF24', error: '#F87171', info: '#22D3EE' },
  },
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', '3xl': '48px' },
  radius: { sm: '6px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
  shadow: { sm: '0 1px 2px rgba(0,0,0,0.3)', glow: '0 0 20px rgba(52,211,153,0.15)' },
} as const;
