
import { render, screen } from '@testing-library/react-native';
import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it.each([
    ['sent', 'НАДІСЛАНА'],
    ['accepted', 'ПРИЙНЯТА'],
    ['inProgress', 'В РОБОТІ'],
    ['done', 'ВИКОНАНА'],
    ['declined', 'ВІДХИЛЕНА'],
  ] as const)('renders the correct label for status "%s"', async (status, label) => {
    await render(<StatusChip status={status} />);

    expect(screen.getByText(label)).toBeTruthy();
  });

  it('has an accessible label', async () => {
    await render(<StatusChip status="accepted" />);

    expect(
      screen.getByLabelText('ПРИЙНЯТА'),
    ).toBeTruthy();
  });
});
