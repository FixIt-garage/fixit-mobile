import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProfileHero } from './ProfileHero';

const props = {
  role: 'client' as const,
  name: 'Олександр Коваль',
  meta: 'Клієнт · Львів · ID 3120',
  stats: [
    { label: 'Заявки', value: '3' },
    { label: 'Відгуки', value: '2' },
    { label: 'З нами з', value: '2026' },
  ],
};

describe('ProfileHero', () => {
  it('shows name, meta, initials and stats', async () => {
    await render(<ProfileHero {...props} onEdit={jest.fn()} onLogout={jest.fn()} />);

    expect(screen.getByRole('header', { name: 'Олександр Коваль' })).toBeTruthy();
    expect(screen.getByText('Клієнт · Львів · ID 3120')).toBeTruthy();
    expect(screen.getByText('ОК')).toBeTruthy();
    expect(screen.getByText('Заявки')).toBeTruthy();
    expect(screen.getByText('2026')).toBeTruthy();
  });

  it('calls edit and logout', async () => {
    const onEdit = jest.fn();
    const onLogout = jest.fn();
    await render(<ProfileHero {...props} onEdit={onEdit} onLogout={onLogout} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Редагувати профіль' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Вийти' }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});