import { fireEvent, render, screen } from '@testing-library/react-native';
import WhoAreYouScreen from './WhoAreYouScreen';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

type ScreenProps = Parameters<typeof WhoAreYouScreen>[0];

function renderScreen() {
  const navigate = jest.fn();
  const goBack = jest.fn();
  const props = { navigation: { navigate, goBack }, route: {} } as unknown as ScreenProps;
  return { navigate, goBack, result: render(<WhoAreYouScreen {...props} />) };
}

describe('WhoAreYouScreen', () => {
  it('shows all four roles', async () => {
    await renderScreen().result;

    for (const label of ['Я — клієнт', 'Я — майстер', 'Це мій сервіс', 'Ми — організація']) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
  });

  it('passes the chosen role to registration', async () => {
    const { navigate, result } = renderScreen();
    await result;

    await fireEvent.press(screen.getByRole('button', { name: 'Я — майстер' }));
    expect(navigate).toHaveBeenCalledWith('SignUp', { role: 'master' });
  });

  it('goes back to the welcome screen', async () => {
    const { goBack, result } = renderScreen();
    await result;

    await fireEvent.press(screen.getByLabelText('Назад'));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});