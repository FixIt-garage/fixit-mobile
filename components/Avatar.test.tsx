import { render, screen } from '@testing-library/react-native';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders initials when image is not provided', async () => {
    await render(<Avatar initials="OK" gradient="client" />);

    expect(screen.getByText('OK')).toBeTruthy();
    expect(screen.getByLabelText('OK')).toBeTruthy();
  });

  it('renders an image when uri is provided', async () => {
    await render(
      <Avatar
        initials="OK"
        gradient="client"
        uri="https://example.com/avatar.png"
      />,
    );

    expect(screen.getByLabelText('OK')).toBeTruthy();
    expect(screen.queryByText('OK')).toBeNull();
  });

  it('uses the default size of 72', async () => {
    await render(<Avatar initials="OK" gradient="client" />);

    expect(screen.getByLabelText('OK').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 72,
          height: 72,
          borderRadius: 16,
        }),
      ]),
    );
  });

  it('supports a custom size', async () => {
    await render(<Avatar initials="OK" gradient="master" size={48} />);

    expect(screen.getByLabelText('OK').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 48,
          height: 48,
          borderRadius: 16,
        }),
      ]),
    );
  });
});