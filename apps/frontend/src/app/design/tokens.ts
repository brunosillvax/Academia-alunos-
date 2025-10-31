export const colors = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  bg: 'var(--bg-dark)',
  card: 'var(--bg-card)',
  sidebar: 'var(--bg-sidebar)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  border: 'var(--border-color)'
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
