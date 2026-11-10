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
import * as BackBarStories from './components/BackBar.stories';
import * as AppBarStories from './components/AppBar.stories';

setProjectAnnotations(preview);

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
  BackBar: BackBarStories,
  AppBar: AppBarStories,
};

describe.each(Object.entries(storyFiles))('%s stories', (_name, storiesModule) => {
  const stories = Object.entries(composeStories(storiesModule)) as [string, ComponentType][];
  it.each(stories)('%s renders', async (_storyName, Story) => {
    await render(<Story />);
  });
});