import type { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ApiError } from '../api/client';
import { MOCK_SERVICE_CENTER } from '../src/api/serviceCenters';
import ServiceCenterProfileScreen, {
  ServiceCenterProfileView,
} from './ServiceCenterProfileScreen';

type MockQuery = {
  data?: unknown;
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  refetch: jest.Mock;
};

let mockCenterQuery: MockQuery;

jest.mock('../src/api/serviceCenters', () => ({
  ...jest.requireActual('../src/api/serviceCenters'),
  useServiceCenter: () => mockCenterQuery,
}));

type Props = ComponentProps<typeof ServiceCenterProfileScreen>;

const navigation = {
  goBack: jest.fn(),
} as unknown as Props['navigation'];

const route = {
  key: 'ServiceCenterProfile',
  name: 'ServiceCenterProfile',
  params: { serviceCenterId: 1182 },
} as Props['route'];

async function renderScreen() {
  await render(
    <ServiceCenterProfileScreen
      navigation={navigation}
      route={route}
    />,
  );
}

describe('ServiceCenterProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockCenterQuery = {
      data: MOCK_SERVICE_CENTER,
      isPending: false,
      isError: false,
      refetch: jest.fn(),
    };
  });

  it('renders the service center profile', async () => {
    await renderScreen();

    expect(
      screen.getByRole('header', { name: 'ТехноСервіс' }),
    ).toBeTruthy();
    expect(
      screen.getByText('СЕРВІСНИЙ ЦЕНТР · ID 1182'),
    ).toBeTruthy();
    expect(screen.getByText('Відчинено до 19:00')).toBeTruthy();

    expect(screen.getByText('Смартфони')).toBeTruthy();
    expect(screen.getByText('Ноутбуки')).toBeTruthy();
    expect(screen.getByText('Побутова техніка')).toBeTruthy();
    expect(screen.getByText('Телевізори')).toBeTruthy();

    expect(screen.getByText('Надіслати заявку')).toBeTruthy();
    expect(screen.queryByText(/Відгуки/)).toBeNull();
  });

  it('renders the closed status', async () => {
    mockCenterQuery = {
      ...mockCenterQuery,
      data: {
        ...MOCK_SERVICE_CENTER,
        isOpen: false,
        workingStatus: 'Зачинено',
      },
    };

    await renderScreen();

    expect(screen.getByText('Зачинено')).toBeTruthy();
  });

  it('shows a loader while the profile loads', async () => {
    mockCenterQuery = {
      isPending: true,
      isError: false,
      refetch: jest.fn(),
    };

    await renderScreen();

    expect(screen.getByLabelText('Завантаження профілю')).toBeTruthy();
    expect(screen.queryByText('ТехноСервіс')).toBeNull();
  });

  it('shows not found for 404', async () => {
    mockCenterQuery = {
      isPending: false,
      isError: true,
      error: new ApiError(404, { detail: 'Service center not found' }),
      refetch: jest.fn(),
    };

    await renderScreen();

    expect(screen.getByText('Сервісний центр не знайдено')).toBeTruthy();
    expect(screen.queryByText('Спробувати ще раз')).toBeNull();
  });

  it('shows a retry button for other profile errors', async () => {
    const refetch = jest.fn();

    mockCenterQuery = {
      isPending: false,
      isError: true,
      error: new Error('Network error'),
      refetch,
    };

    await renderScreen();

    expect(screen.getByText('Не вдалося завантажити профіль')).toBeTruthy();

    await fireEvent.press(screen.getByText('Спробувати ще раз'));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('goes back', async () => {
    await renderScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Назад' }));

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });
});

describe('ServiceCenterProfileView', () => {
  it('calls the request action when the button is pressed', async () => {
    const onRequest = jest.fn();

    await render(
      <ServiceCenterProfileView
        center={MOCK_SERVICE_CENTER}
        onBack={jest.fn()}
        onRequest={onRequest}
      />,
    );

    await fireEvent.press(screen.getByText('Надіслати заявку'));

    expect(onRequest).toHaveBeenCalledTimes(1);
  });
});
