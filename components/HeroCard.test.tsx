import { render, screen } from '@testing-library/react-native';
import { HeroCard } from './HeroCard';
import { Text } from './Text';

describe('HeroCard', () => {
  it('renders its content for both accents', async () => {
    const { rerender } = await render(
      <HeroCard>
        <Text>Олександр Коваль</Text>
      </HeroCard>,
    );
    expect(screen.getByText('Олександр Коваль')).toBeTruthy();

    await rerender(
      <HeroCard accent="master">
        <Text>Андрій Мельник</Text>
      </HeroCard>,
    );
    expect(screen.getByText('Андрій Мельник')).toBeTruthy();
  });
});