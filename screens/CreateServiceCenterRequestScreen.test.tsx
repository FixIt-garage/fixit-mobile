import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

import { createIssue } from '../src/api/issues';
import { MOCK_SERVICE_CENTER } from '../src/api/serviceCenters';
import CreateServiceCenterRequestScreen from './CreateServiceCenterRequestScreen';

jest.mock('../src/api/serviceCenters', () => {
  const actual = jest.requireActual('../src/api/serviceCenters');

  return {
    ...actual,
    useServiceCenter: () => ({
      data: actual.MOCK_SERVICE_CENTER,
      isPending: false,
      isError: false,
      refetch: jest.fn(),
    }),
  };
});

jest.mock('../src/api/issues', () => ({
  ...jest.requireActual('../src/api/issues'),
  createIssue: jest.fn(),
}));

const mockCreateIssue = jest.mocked(createIssue);

const navigation = {
  replace: jest.fn(),
  goBack: jest.fn(),
};

const route = {
  key: 'CreateServiceCenterRequest',
  name: 'CreateServiceCenterRequest',
  params: {
    serviceCenterId: 1182,
    description: undefined as string | undefined,
  },
};

async function renderScreen() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

  await render(
    <QueryClientProvider client={queryClient}>
      <CreateServiceCenterRequestScreen
        navigation={navigation as never}
        route={route as never}
      />
    </QueryClientProvider>,
  );
}

async function fillForm() {
  await fireEvent.press(screen.getByText('Смартфони'));

  await fireEvent.changeText(
    screen.getByLabelText('Назва проблеми'),
    'Ремонт смартфона',
  );

  await fireEvent.changeText(
    screen.getByLabelText('Опис проблеми'),
    'Розбитий екран',
  );
}

describe('CreateServiceCenterRequestScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateIssue.mockReset();
  });

  it('renders the form and keeps submit disabled initially', async () => {
    await renderScreen();

    expect(screen.getByText('Опишіть проблему')).toBeTruthy();
    expect(
      screen.getByText(/Заявка буде надіслана до сервісного центру/),
    ).toBeTruthy();
    expect(screen.getByLabelText('Назва проблеми')).toBeTruthy();
    expect(screen.getByLabelText('Опис проблеми')).toBeTruthy();

    expect(
      screen.getByRole('button', { name: 'Надіслати заявку' }).props
        .accessibilityState.disabled,
    ).toBe(true);
  });

  it('prefills the problem description from navigation params', async () => {
    route.params.description = 'Потрібно відремонтувати розбитий екран';

    await renderScreen();

    expect(screen.getByLabelText('Опис проблеми').props.value).toBe(
      'Потрібно відремонтувати розбитий екран',
    );
  });

  it('creates an issue with the selected category and service center', async () => {
    mockCreateIssue.mockResolvedValueOnce({
      id: 501,
      title: 'Ремонт смартфона',
    } as never);

    await renderScreen();
    await fillForm();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Надіслати заявку' }).props
          .accessibilityState.disabled,
      ).toBe(false);
    });

    await fireEvent.press(
      screen.getByRole('button', { name: 'Надіслати заявку' }),
    );

    await waitFor(() => {
      expect(mockCreateIssue).toHaveBeenCalledTimes(1);
      expect(mockCreateIssue.mock.calls[0][0]).toEqual({
        title: 'Ремонт смартфона',
        description: 'Розбитий екран',
        category_id: MOCK_SERVICE_CENTER.categories[0].id,
        assignee_company_id: MOCK_SERVICE_CENTER.id,
      });
    });

    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith('RequestDetails', {
        issueId: 501,
        title: 'Ремонт смартфона',
      });
    });
  });

  it('shows an error when issue creation fails', async () => {
    mockCreateIssue.mockRejectedValueOnce(new Error('Network error'));

    await renderScreen();
    await fillForm();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Надіслати заявку' }),
    );

    expect(
      await screen.findByText(
        "Не вдалося надіслати заявку. Перевірте з'єднання та спробуйте ще раз.",
      ),
    ).toBeTruthy();

    expect(navigation.replace).not.toHaveBeenCalled();
  });
});
