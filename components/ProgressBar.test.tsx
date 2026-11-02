import { StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { ProgressBar } from './ProgressBar';

function fillWidth() {
  return StyleSheet.flatten(screen.getByTestId('progress-fill').props.style).width;
}

describe('ProgressBar', () => {
  it('fills according to value', async () => {
    await render(<ProgressBar value={0.4} />);
    expect(fillWidth()).toBe('40%');
  });

  it('clamps values above 1 and below 0', async () => {
    await render(<ProgressBar value={1.5} />);
    expect(fillWidth()).toBe('100%');

    await render(<ProgressBar value={-0.2} />);
    expect(fillWidth()).toBe('0%');
  });

  it('exposes progress to screen readers', async () => {
    await render(<ProgressBar value={0.75} />);
    expect(screen.getByRole('progressbar').props.accessibilityValue).toEqual({
      min: 0,
      max: 100,
      now: 75,
    });
  });
});