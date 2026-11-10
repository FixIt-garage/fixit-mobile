import type { ComponentType } from 'react';
import { render } from '@testing-library/react-native';
import { composeStories, setProjectAnnotations } from '@storybook/react';
import * as preview from './.rnstorybook/preview';

import * as ButtonStories from './components/Button.stories';
import * as IconButtonStories from './components/IconButton.stories';
import * as IconStories from './components/Icon/Icon.stories';
import * as LogoStories from './components/Logo/Logo.stories';
import * as InputStories from './components/Input.stories';
import * as ProgressBarStories from './components/ProgressBar.stories';
import * as SegmentedControlStories from './components/SegmentedControl.stories';
import * as SlideButtonStories from './components/SlideButton.stories';
import * as TextAreaStories from './components/TextArea.stories';
import * as ToggleStories from './components/Toggle.stories';
import * as RoleCardStories from './components/RoleCard.stories';
import * as TextStories from './components/Text.stories';
import * as ColorsStories from './src/theme/Colors.stories';
import * as GradientsStories from './src/theme/Gradients.stories';
import * as TypographyStories from './src/theme/Typography.stories';
import * as SpacingAndRadiusStories from './src/theme/SpacingAndRadius.stories';

jest.mock('lucide-react-native', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');

  const MockLucideIcon = () =>
    React.createElement(View, { testID: 'mock-lucide-icon' });

  return {
    __esModule: true,
    Bell: MockLucideIcon,
    Calendar: MockLucideIcon,
    Camera: MockLucideIcon,
    Check: MockLucideIcon,
    ChevronLeft: MockLucideIcon,
    ChevronRight: MockLucideIcon,
    CircleAlert: MockLucideIcon,
    CirclePlus: MockLucideIcon,
    ClipboardList: MockLucideIcon,
    Clock: MockLucideIcon,
    EyeOff: MockLucideIcon,
    Flag: MockLucideIcon,
    HeartHandshake: MockLucideIcon,
    House: MockLucideIcon,
    LogOut: MockLucideIcon,
    Mail: MockLucideIcon,
    MapPin: MockLucideIcon,
    MessageCircle: MockLucideIcon,
    MessageSquareText: MockLucideIcon,
    Pencil: MockLucideIcon,
    Phone: MockLucideIcon,
    Search: MockLucideIcon,
    Send: MockLucideIcon,
    Star: MockLucideIcon,
    Store: MockLucideIcon,
    User: MockLucideIcon,
    Wrench: MockLucideIcon,
    X: MockLucideIcon,
  };
});
// Ті самі декоратори, що й у Storybook: тема і полотно 360
setProjectAnnotations(preview);

// Нову *.stories.tsx додавай сюди — кожна її story стане smoke-тестом
const storyFiles = {
  Button: ButtonStories,
  IconButton: IconButtonStories,
  Icon: IconStories,
  Logo: LogoStories,
  Input: InputStories,
  ProgressBar: ProgressBarStories,
  SegmentedControl: SegmentedControlStories,
  SlideButton: SlideButtonStories,
  TextArea: TextAreaStories,
  Toggle: ToggleStories,
  RoleCard: RoleCardStories,
  Text: TextStories,
  Colors: ColorsStories,
  Gradients: GradientsStories,
  Typography: TypographyStories,
  SpacingAndRadius: SpacingAndRadiusStories,
};

describe.each(Object.entries(storyFiles))('%s stories', (_name, storiesModule) => {
  // Усі stories після composeStories — звичайні компоненти без обовʼязкових пропсів
  const stories = Object.entries(composeStories(storiesModule)) as [string, ComponentType][];
  it.each(stories)('%s renders', async (_storyName, Story) => {
    await render(<Story />);
  });
});