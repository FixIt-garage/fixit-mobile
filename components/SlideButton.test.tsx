import type { ReactNode } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SlideButton } from './SlideButton';

// Обробники жесту, які SlideButton передав у Gesture.Pan()
const mockHandlers: Record<string, (...args: unknown[]) => void> = {};

// У Jest немає UI-потоку телефона, тому жести підмінюємо:
// GestureDetector просто показує вміст, а Gesture.Pan() запамʼятовує обробники,
// щоб тест міг сам «провести пальцем».
jest.mock('react-native-gesture-handler', () => {
  const chain: Record<string, unknown> = new Proxy(
    {},
    {
      get: (_target, name: string) => (handler: unknown) => {
        if (typeof handler === 'function') {
          mockHandlers[name] = handler as (...args: unknown[]) => void;
        }
        return chain;
      },
    },
  );
  return {
    GestureDetector: ({ children }: { children: ReactNode }) => children,
    GestureHandlerRootView: ({ children }: { children: ReactNode }) => children,
    Gesture: { Pan: () => chain },
  };
});

const activate = { nativeEvent: { actionName: 'activate' } };
// Ширина як у Figma: шлях кружечка = 328 − 52 − 6 − 6 = 264
const layout = { nativeEvent: { layout: { width: 328, height: 64 } } };

async function renderAndMeasure(onConfirm: () => void) {
  await render(<SlideButton label="Увійти" onConfirm={onConfirm} />);
  await fireEvent(screen.getByRole('button'), 'layout', layout);
}

async function swipe(translationX: number, success: boolean) {
  await act(async () => {
    mockHandlers.onUpdate({ translationX });
    mockHandlers.onEnd({}, success);
  });
}

describe('SlideButton', () => {
  it('is announced as a button with its label', async () => {
    await render(<SlideButton label="Увійти" onConfirm={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Увійти' })).toBeTruthy();
  });

  it('confirms exactly once after a successful swipe past the threshold', async () => {
    const onConfirm = jest.fn();
    await renderAndMeasure(onConfirm);

    await swipe(300, true);
    await swipe(300, true);

    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
  });

  it('does not confirm a cancelled swipe, even past the threshold', async () => {
    const onConfirm = jest.fn();
    await renderAndMeasure(onConfirm);

    await swipe(300, false);

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('does not confirm a short swipe', async () => {
    const onConfirm = jest.fn();
    await renderAndMeasure(onConfirm);

    await swipe(100, true);

    expect(onConfirm).not.toHaveBeenCalled();
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