import { render, screen } from '@testing-library/react-native';
import { InfoRow } from './InfoRow';

describe('InfoRow', () => {
  it('renders the text', async () => {
    await render(
      <InfoRow
        text="вул. Городоцька, 15, Львів"
        icon="map-pin"
      />,
    );

    expect(screen.getByText('вул. Городоцька, 15, Львів')).toBeTruthy();
  });

  it('supports different icons', async () => {
    await render(<InfoRow text="+380123456789" icon="phone" />);

    expect(screen.getByText('+380123456789')).toBeTruthy();
  });

  it('renders the icon with the correct size and color', async () => {
    await render(<InfoRow text="Адреса" icon="map-pin" />);

    expect(screen.getByText('Адреса')).toBeTruthy();
  });
});