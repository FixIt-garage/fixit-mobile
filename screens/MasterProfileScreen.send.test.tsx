import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MasterProfileScreen, { SEND_REQUEST_ERROR } from './MasterProfileScreen';
import {
    MOCK_MASTER_PUBLIC,
    MOCK_REVIEWS,
    useMasterPublic,
    useMasterReviews,
} from '../src/api/masterPublic';
import { useCreateIssue } from '../src/api/issueCreate';

jest.mock('../src/api/masterPublic', () => ({
    ...jest.requireActual('../src/api/masterPublic'),
    useMasterPublic: jest.fn(),
    useMasterReviews: jest.fn(),
}));

jest.mock('../src/api/issueCreate', () => ({
    ...jest.requireActual('../src/api/issueCreate'),
    useCreateIssue: jest.fn(),
}));

const mockedUseMasterPublic = jest.mocked(useMasterPublic);
const mockedUseMasterReviews = jest.mocked(useMasterReviews);
const mockedUseCreateIssue = jest.mocked(useCreateIssue);

const METRICS = {
    frame: { x: 0, y: 0, width: 390, height: 844 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const DRAFT = { categoryId: 4, description: 'Пральна машина не зливає воду' };

const navigation = { goBack: jest.fn(), replace: jest.fn() };

function mockCreateIssue(overrides: Record<string, unknown> = {}) {
    const mutate = jest.fn();
    mockedUseCreateIssue.mockReturnValue({
        mutate,
        isPending: false,
        isError: false,
        ...overrides,
    } as unknown as ReturnType<typeof useCreateIssue>);
    return mutate;
}

async function renderScreen(params: Record<string, unknown>) {
    await render(
        <SafeAreaProvider initialMetrics={METRICS}>
            <MasterProfileScreen
                navigation={navigation as never}
                route={{ key: 'MasterProfile', name: 'MasterProfile', params } as never}
            />
        </SafeAreaProvider>,
    );
}

beforeEach(() => {
    jest.clearAllMocks();
    mockedUseMasterPublic.mockReturnValue({
        data: MOCK_MASTER_PUBLIC,
        isPending: false,
        isError: false,
    } as unknown as ReturnType<typeof useMasterPublic>);
    mockedUseMasterReviews.mockReturnValue({
        data: MOCK_REVIEWS,
        isPending: false,
        isError: false,
    } as unknown as ReturnType<typeof useMasterReviews>);
});

describe('MasterProfileScreen send request', () => {
    it('hides the button without a draft', async () => {
        mockCreateIssue();

        await renderScreen({ masterId: 12 });

        expect(screen.queryByText('Надіслати заявку')).toBeNull();
    });

    it('sends the draft to this master and opens the request', async () => {
        const mutate = mockCreateIssue();
        mutate.mockImplementation((_variables, options) =>
            options.onSuccess({ id: 101, title: 'Пральна машина не зливає воду' }),
        );

        await renderScreen({ masterId: 12, draft: DRAFT });
        await fireEvent.press(screen.getByText('Надіслати заявку'));

        expect(mutate).toHaveBeenCalledWith(
            { draft: DRAFT, assignee: { masterId: 12 } },
            expect.any(Object),
        );
        expect(navigation.replace).toHaveBeenCalledWith('RequestDetails', {
            issueId: 101,
            title: 'Пральна машина не зливає воду',
        });
    });

    it('blocks the button while sending', async () => {
        const mutate = mockCreateIssue({ isPending: true });

        await renderScreen({ masterId: 12, draft: DRAFT });
        const button = screen.getByLabelText('Надіслати заявку');

        expect(button.props.accessibilityState).toEqual(
            expect.objectContaining({ busy: true, disabled: true }),
        );

        await fireEvent.press(button);

        expect(mutate).not.toHaveBeenCalled();
    });

    it('shows an error when sending fails', async () => {
        mockCreateIssue({ isError: true });

        await renderScreen({ masterId: 12, draft: DRAFT });

        expect(screen.getByText(SEND_REQUEST_ERROR)).toBeTruthy();
    });
});