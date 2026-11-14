import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProfileCompletionCard } from './ProfileCompletionCard';

describe('ProfileCompletionCard', () => {
  it('shows the percent and the hint', async () => {
    await render(
      <ProfileCompletionCard
        progress={0.4}
        hint="Додайте фото — майстрам буде простіше вас впізнати."
        onAction={jest.fn()}
      />,
    );

    expect(screen.getByText('40%')).toBeTruthy();
    expect(screen.getByText('Додайте фото — майстрам буде простіше вас впізнати.')).toBeTruthy();
    expect(screen.getByRole('progressbar').props.accessibilityValue).toMatchObject({ now: 40 });
  });

  it('calls onAction', async () => {
    const onAction = jest.fn();
    await render(<ProfileCompletionCard progress={0.4} hint="Підказка" onAction={onAction} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Заповнити зараз' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});