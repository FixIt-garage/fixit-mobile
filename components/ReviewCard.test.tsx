import { render, screen } from '@testing-library/react-native';
import { ReviewCard } from './ReviewCard';

describe('ReviewCard', () => {
  it('shows name, rating and text', async () => {
    await render(
      <ReviewCard name="Ірина" rating={5} text="Швидко полагодив пральну машину, все пояснив." />,
    );

    expect(screen.getByText('Ірина')).toBeTruthy();
    expect(screen.getByText('5,0')).toBeTruthy();
    expect(screen.getByText('Швидко полагодив пральну машину, все пояснив.')).toBeTruthy();
  });

  it('is not pressable', async () => {
    await render(<ReviewCard name="Ірина" rating={5} text="Дякую!" />);

    expect(screen.queryByRole('button')).toBeNull();
  });
});