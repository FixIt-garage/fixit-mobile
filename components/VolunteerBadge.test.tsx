
import { render, screen } from '@testing-library/react-native';
import { VolunteerBadge } from './VolunteerBadge';

describe('VolunteerBadge', () => {
  it('renders the volunteer label', async () => {
    await render(<VolunteerBadge />);

    expect(screen.getByText('ВОЛОНТЕР')).toBeTruthy();
  });

  it('has an accessible label', async () => {
    await render(<VolunteerBadge />);

    expect(screen.getByLabelText('Волонтер')).toBeTruthy();
  });

  it('renders the flag icon', async () => {
    await render(<VolunteerBadge />);

    expect(screen.getByTestId('volunteer-flag')).toBeTruthy();
  });
});
