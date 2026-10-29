export const colors = {
  bg: {
    screen: '#F6F7F9',
    surface: '#FFFFFF',
    subtle: '#EEF0F3',
    brand: '#2563EB',
    brandPressed: '#1D4ED8',
    brandSoft: '#EFF4FF',
    inverse: '#111827',
    successSoft: '#F0FDF4',
    errorSoft: '#FEF2F2',
  },
  border: {
    default: '#E3E6EB',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    onInverse: '#FFFFFF',
    onInverseMuted: '#9CA3AF',
    success: '#16A34A',
    error: '#DC2626',
  },
  rating: '#F59E0B',
  role: {
    client: '#2563EB',
    master: '#7C3AED',
    center: '#EA580C',
    org: '#16A34A',
  },
} as const;

export type Colors = typeof colors;