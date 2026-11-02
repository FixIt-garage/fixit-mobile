import { fireEvent, render, screen } from '@testing-library/react-native';
import { SlideButton } from './SlideButton';
import type { ReactNode } from 'react';

// У Jest немає UI-потоку телефона, тому жести підмінюємо:
// GestureDetector просто показує вміст, а налаштування жесту нічого не роблять.
// Сам свайп перевіряється вручну на пристрої.
jest.mock('react-native-gesture-handler', () => {
  const chain: Record<string, unknown> = new Proxy({}, { get: () => () => chain });
  return {
    GestureDetector: ({ children }: { children: ReactNode }) => children,
    GestureHandlerRootView: ({ children }: { children: ReactNode }) => children,
    Gesture: { Pan: () => chain },
  };
});
const activate = { nativeEvent: { actionName: 'activate' } };

describe('SlideButton', () => {
  it('is announced as a button with its label', async () => {
    await render(<SlideButton label="Увійти" onConfirm={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Увійти' })).toBeTruthy();
  });

  it('fires onConfirm once via the accessibility fallback', async () => {
    const onConfirm = jest.fn();
    await render(<SlideButton label="Увійти" onConfirm={onConfirm} />);

    const button = screen.getByRole('button', { name: 'Увійти' });
    await fireEvent(button, 'accessibilityAction', activate);
    await fireEvent(button, 'accessibilityAction', activate);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('switches to the done state after confirming', async () => {
    await render(<SlideButton label="Увійти" onConfirm={jest.fn()} />);

    expect(screen.getByText('›››')).toBeTruthy();
    await fireEvent(screen.getByRole('button'), 'accessibilityAction', activate);
    expect(screen.queryByText('›››')).toBeNull();
  });

  it('does nothing when disabled', async () => {
    const onConfirm = jest.fn();
    await render(<SlideButton label="Увійти" disabled onConfirm={onConfirm} />);

    await fireEvent(screen.getByRole('button'), 'accessibilityAction', activate);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});