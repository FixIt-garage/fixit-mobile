import { render, screen } from '@testing-library/react-native';
import { ContactsCard } from './ContactsCard';

describe('ContactsCard', () => {
  it('shows all contacts', async () => {
    await render(
      <ContactsCard
        phone="+380 67 123 45 67"
        email="oleksandr.koval@gmail.com"
        address="Львів, вул. Наукова, 7"
      />,
    );

    expect(screen.getByText('+380 67 123 45 67')).toBeTruthy();
    expect(screen.getByText('oleksandr.koval@gmail.com')).toBeTruthy();
    expect(screen.getByText('Львів, вул. Наукова, 7')).toBeTruthy();
  });

  it('hides empty rows', async () => {
    await render(<ContactsCard email="a@b.ua" address={null} />);

    expect(screen.getByText('a@b.ua')).toBeTruthy();
    expect(screen.queryByText('Львів, вул. Наукова, 7')).toBeNull();
  });
});