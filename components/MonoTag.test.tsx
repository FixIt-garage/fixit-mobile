
import { render, screen } from '@testing-library/react-native';
import { MonoTag } from './MonoTag';

describe('MonoTag', () => {
  it('renders the provided label', async () => {
    await render(<MonoTag label="Виконано" />);

    expect(screen.getByText('Виконано')).toBeTruthy();
  });

  it('has an accessible label', async () => {
    await render(<MonoTag label="Виконано" />);

    expect(screen.getByLabelText('Виконано')).toBeTruthy();
  });

  it('renders different labels', async () => {
    await render(<MonoTag label="Успішно" />);

    expect(screen.getByText('Успішно')).toBeTruthy();
  });
});
