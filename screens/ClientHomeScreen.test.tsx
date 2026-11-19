import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { MOCK_CATEGORIES } from '../src/api/categories';
import { MOCK_PROFILE } from '../src/api/profile';
import ClientHomeScreen from './ClientHomeScreen';

const mockNavigate = jest.fn();
let mockCategoriesQuery: { data?: unknown; isPending: boolean; isError: boolean; refetch: jest.Mock };

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../src/auth/AuthProvider', () => ({
    useAuth: () => ({
        state: { status: 'signedIn', user: { firstName: 'Олександр', lastName: 'Коваль' } },
    }),
}));

jest.mock('../src/api/profile', () => ({
    ...jest.requireActual('../src/api/profile'),
    useMyProfile: () => ({ data: { ...jest.requireActual('../src/api/profile').MOCK_PROFILE } }),
}));

jest.mock('../src/api/categories', () => ({
    ...jest.requireActual('../src/api/categories'),
    useCategories: () => mockCategoriesQuery,
}));

describe('ClientHomeScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCategoriesQuery = { data: MOCK_CATEGORIES, isPending: false, isError: false, refetch: jest.fn() };
    });

    it('greets the client and prefills the city', async () => {
        await render(<ClientHomeScreen />);

        expect(await screen.findByText('Привіт, Олександре')).toBeTruthy();
        expect(screen.getByRole('header', { name: 'Що зламалося?' })).toBeTruthy();
        expect(screen.getByDisplayValue(MOCK_PROFILE.city as string)).toBeTruthy();
    });

    it('shows only top-level categories and selects one', async () => {
        await render(<ClientHomeScreen />);

        expect(screen.queryByText('Пральні машини')).toBeNull();
        const chip = screen.getByRole('button', { name: 'Побутова техніка' });

        await fireEvent.press(chip);

        expect(screen.getByRole('button', { name: 'Побутова техніка' }).props.accessibilityState).toMatchObject({
            selected: true,
        });
    });

    it('requires a category and a description', async () => {
        await render(<ClientHomeScreen />);

        await fireEvent.press(screen.getByText('Знайти майстра'));

        expect(await screen.findByText('Оберіть категорію')).toBeTruthy();
        expect(screen.getByText('Опишіть, що зламалося')).toBeTruthy();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates to search results with the params', async () => {
        await render(<ClientHomeScreen />);

        await fireEvent.press(screen.getByRole('button', { name: 'Сантехніка' }));
        await fireEvent.changeText(
            screen.getByLabelText('Що зламалося?'),
            '  Тече кран на кухні  ',
        );
        await fireEvent.press(screen.getByText('Знайти майстра'));

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith('SearchResults', {
                city: 'Львів',
                categoryId: 3,
                description: 'Тече кран на кухні',
            }),
        );
    });

    it('lets retry when categories fail to load', async () => {
        mockCategoriesQuery = { isPending: false, isError: true, refetch: jest.fn() };
        await render(<ClientHomeScreen />);

        await fireEvent.press(screen.getByText('Спробувати ще раз'));

        expect(mockCategoriesQuery.refetch).toHaveBeenCalledTimes(1);
    });
});