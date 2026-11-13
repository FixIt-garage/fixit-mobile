import type { ComponentProps } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ApiError } from '../api/client';
import SignUpScreen from './SignUpScreen';

const mockSignUp = jest.fn();

jest.mock('../src/auth/AuthProvider', () => ({
    useAuth: () => ({ signUp: mockSignUp }),
}));

type Props = ComponentProps<typeof SignUpScreen>;

const navigation = { goBack: jest.fn() } as unknown as Props['navigation'];
const route = { key: 'SignUp', name: 'SignUp', params: { role: 'client' } } as Props['route'];

async function renderScreen() {
    await render(<SignUpScreen navigation={navigation} route={route} />);
}

async function fillForm() {
    await fireEvent.changeText(screen.getByLabelText('Імʼя'), 'Анна');
    await fireEvent.changeText(screen.getByLabelText('Прізвище'), 'Шеремета');
    await fireEvent.changeText(screen.getByLabelText('Телефон'), '0671234567');
    await fireEvent.changeText(screen.getByLabelText('Пошта'), 'anna@gmail.com');
    await fireEvent.changeText(screen.getByLabelText('Адреса'), 'Львів, Городоцька, 15');
    await fireEvent.changeText(screen.getByLabelText('Пароль'), 'password1');
}

describe('SignUpScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows the step for the chosen role', async () => {
        await renderScreen();

        expect(screen.getByText('Крок 2 / 2 · акаунт клієнта')).toBeTruthy();
    });

    it('shows validation errors and does not submit an empty form', async () => {
        await renderScreen();

        await fireEvent.press(screen.getByText('Зареєструватися'));

        expect(await screen.findByText('Вкажіть імʼя')).toBeTruthy();
        expect(screen.getByText('Щонайменше 8 символів')).toBeTruthy();
        expect(mockSignUp).not.toHaveBeenCalled();
    });

    it('formats the phone while typing', async () => {
        await renderScreen();

        await fireEvent.changeText(screen.getByLabelText('Телефон'), '0671234567');

        expect(screen.getByDisplayValue('+380 67 123 45 67')).toBeTruthy();
    });
    it('shows a validation error instead of a network error for 422', async () => {
        mockSignUp.mockRejectedValueOnce(
            new ApiError(422, { detail: [{ loc: ['body', 'address'], msg: 'too long' }] }),
        );
        await renderScreen();
        await fillForm();

        await fireEvent.press(screen.getByText('Зареєструватися'));

        expect(await screen.findByText('Перевірте дані у формі.')).toBeTruthy();
        expect(screen.getByText('Перевірте це поле')).toBeTruthy();
        expect(screen.queryByText(/Перевірте інтернет/)).toBeNull();
    });
    it('submits the form with the backend phone format and role', async () => {
        mockSignUp.mockResolvedValueOnce(undefined);
        await renderScreen();
        await fillForm();

        await fireEvent.press(screen.getByText('Зареєструватися'));

        await waitFor(() =>
            expect(mockSignUp).toHaveBeenCalledWith({
                firstName: 'Анна',
                lastName: 'Шеремета',
                phone: '+380671234567',
                email: 'anna@gmail.com',
                address: 'Львів, Городоцька, 15',
                password: 'password1',
                role: 'client',
            }),
        );
    });

    it('shows a server error under the email field', async () => {
        mockSignUp.mockRejectedValueOnce(
            new ApiError(409, { detail: 'A user with this email already exists' }),
        );
        await renderScreen();
        await fillForm();

        await fireEvent.press(screen.getByText('Зареєструватися'));

        expect(await screen.findByText('Ця пошта вже зареєстрована')).toBeTruthy();
    });

    it('goes back', async () => {
        await renderScreen();

        await fireEvent.press(screen.getByLabelText('Назад'));

        expect(navigation.goBack).toHaveBeenCalled();
    });
});