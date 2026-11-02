import { render } from '@testing-library/react-native';
import { composeStories, setProjectAnnotations } from '@storybook/react';
import * as preview from './.rnstorybook/preview';

import * as ButtonStories from './components/Button.stories';

// Ті самі декоратори, що й у Storybook: тема і полотно 360
setProjectAnnotations(preview);

// Нову *.stories.tsx додавай сюди — кожна її story стане smoke-тестом
const storyFiles = {
  Button: ButtonStories,
};

describe.each(Object.entries(storyFiles))('%s stories', (_name, storiesModule) => {
  const stories = Object.entries(composeStories(storiesModule));

  it.each(stories)('%s renders', async (_storyName, Story) => {
    await render(<Story />);
  });
});