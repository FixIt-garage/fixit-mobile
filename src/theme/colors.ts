export const colors = {
  bg: {
    screen: '#F6F7F9',
    surface: '#FFFFFF',
    subtle: '#EEF0F3',
    brand: '#2563EB',
    brandPressed: '#1D4ED8',
    brandSoft: '#EFF4FF',
    warningSoft: '#FFFBEB',
    inverse: '#111827',
    successSoft: '#F0FDF4',
    errorSoft: '#FEF2F2',
  },
  border: {
    default: '#E3E6EB',
    focus: '#2563EB',
    error: '#DC2626',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    onInverse: '#FFFFFF',
    onInverseMuted: '#9CA3AF',
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#DC2626',
    brand: '#2563EB',
    onBrand: '#FFFFFF',
  },
  rating: '#F59E0B',
  role: {
    client: '#2563EB',
    master: '#7C3AED',
    center: '#EA580C',
    org: '#16A34A',
  },
    roleSoft: {
    center: '#FFF7ED',
  },
  icon: {
    default: '#111827',
  },
  // Напівпрозорі кольори для елементів на градієнті
  glass: {
    bg: '#FFFFFF33', // білий 20%
    border: '#FFFFFF4D', // білий 30%
    grid: '#FFFFFF0F', // білий 6%, лінії сітки-креслення
    button: '#FFFFFF1A',
    buttonBorder: '#FFFFFF26',
    divider: '#FFFFFF1F',
  },
} as const;

export type Colors = typeof colors;