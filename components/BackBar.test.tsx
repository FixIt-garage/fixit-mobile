import { fireEvent, render, screen } from '@testing-library/react-native';
import { BackBar } from './BackBar';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

describe('BackBar', () => {
  beforeEach(() => mockGoBack.mockClear());

  it('shows the title as a header', async () => {
    await render(<BackBar title="Деталі заявки" />);
    expect(screen.getByRole('header', { name: 'Деталі заявки' })).toBeTruthy();
  });

  it('goes back by default', async () => {
    await render(<BackBar title="Деталі заявки" />);

    await fireEvent.press(screen.getByRole('button', { name: 'Назад' }));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('uses a custom onBack instead of going back', async () => {
    const onBack = jest.fn();
    await render(<BackBar title="Деталі заявки" onBack={onBack} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Назад' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});