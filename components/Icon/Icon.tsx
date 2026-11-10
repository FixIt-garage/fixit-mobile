import {
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CirclePlus,
  ClipboardList,
  Clock,
  Eye,
  EyeOff,
  Flag,
  HeartHandshake,
  House,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Pencil,
  Phone,
  Search,
  Send,
  Star,
  Store,
  User,
  Wrench,
  X,
} from 'lucide-react-native';
import { useTheme, type Theme } from '../../src/theme';

const iconMap = {
  search: Search,
  'circle-plus': CirclePlus,
  'clipboard-list': ClipboardList,
  'message-circle': MessageCircle,
  user: User,
  wrench: Wrench,
  star: Star,
  'map-pin': MapPin,
  clock: Clock,
  phone: Phone,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'heart-handshake': HeartHandshake,
  send: Send,
  check: Check,
  x: X,
  'circle-alert': CircleAlert,
  bell: Bell,
  camera: Camera,
  calendar: Calendar,
  house: House,
  flag: Flag,
  store: Store,
  'eye-off': EyeOff,
  eye: Eye,
  mail: Mail,
  'log-out': LogOut,
  pencil: Pencil,
  'message-square-text': MessageSquareText,
} as const;

export type IconName = keyof typeof iconMap;

export const iconNames = Object.keys(iconMap) as IconName[];

export type IconColor =
  | 'icon/default'
  | 'text/primary'
  | 'text/secondary'
  | 'text/disabled'
  | 'text/brand'
  | 'text/onBrand'
  | 'text/onInverse'
  | 'text/onInverseMuted'
  | 'text/success'
  | 'text/error';

function resolveColor(colors: Theme['colors'], token: IconColor): string {
  switch (token) {
    case 'icon/default':
      return colors.icon.default;
    case 'text/primary':
      return colors.text.primary;
    case 'text/secondary':
      return colors.text.secondary;
    case 'text/disabled':
      return colors.text.disabled;
    case 'text/brand':
      return colors.text.brand;
    case 'text/onBrand':
      return colors.text.onBrand;
    case 'text/onInverse':
      return colors.text.onInverse;
    case 'text/onInverseMuted':
      return colors.text.onInverseMuted;
    case 'text/success':
      return colors.text.success;
    case 'text/error':
      return colors.text.error;
  }
}

export type IconProps = {
  name: IconName;
  size?: number;
  color?: IconColor;
  testID?: string;
};

export function Icon({ name, size = 24, color = 'text/primary', testID }: IconProps) {
  const theme = useTheme();
  const LucideIcon = iconMap[name];

  return (
    <LucideIcon
      size={size}
      color={resolveColor(theme.colors, color)}
      testID={testID}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}