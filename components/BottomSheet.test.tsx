import { render, screen } from '@testing-library/react-native';
import { BottomSheet } from './BottomSheet';
import { Text } from './Text';

describe('BottomSheet', () => {
  it('renders content without a handle by default', async () => {
    await render(
      <BottomSheet>
        <Text>Вміст</Text>
      </BottomSheet>,
    );

    expect(screen.getByText('Вміст')).toBeTruthy();
    expect(screen.queryByTestId('bottom-sheet-handle')).toBeNull();
  });

  it('shows the handle when asked', async () => {
    await render(
      <BottomSheet handle>
        <Text>Вміст</Text>
      </BottomSheet>,
    );

    expect(screen.getByTestId('bottom-sheet-handle')).toBeTruthy();
  });
});