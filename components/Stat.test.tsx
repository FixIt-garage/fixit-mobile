import { render, screen } from '@testing-library/react-native';
import { Stat } from './Stat';

describe('Stat', () => {
  it('renders the value', async () => {
    await render(<Stat value="4,8" label="Рейтинг" />);

    expect(screen.getByText('4,8')).toBeTruthy();
  });

  it('renders the label', async () => {
    await render(<Stat value="4,8" label="Рейтинг" />);

    expect(screen.getByText('Рейтинг')).toBeTruthy();
  });

  it('renders both value and label', async () => {
    await render(<Stat value="12" label="Заявки" />);

    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('Заявки')).toBeTruthy();
  });
});
