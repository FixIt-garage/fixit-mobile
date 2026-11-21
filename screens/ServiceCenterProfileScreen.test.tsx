import type { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ApiError } from '../api/client';
import {
  MOCK_SERVICE_CENTER,
  MOCK_SERVICE_CENTER_REVIEWS,
} from '../src/api/serviceCenters';
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
let mockReviewsQuery: MockQuery;
let mockReviewsCompanyId: number | undefined;

jest.mock('../src/api/serviceCenters', () => ({
  ...jest.requireActual('../src/api/serviceCenters'),
  useServiceCenter: () => mockCenterQuery,
  useServiceCenterReviews: (companyId: number) => {
    mockReviewsCompanyId = companyId;
    return mockReviewsQuery;
  },
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
    <ServiceCenterProfileScreen navigation={navigation} route={route} />,
  );
}

describe('ServiceCenterProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockReviewsCompanyId = undefined;
    mockReviewsQuery = {
      data: MOCK_SERVICE_CENTER_REVIEWS,
      isPending: false,
      isError: false,
      refetch: jest.fn(),
    };

    mockCenterQuery = {
      data: MOCK_SERVICE_CENTER,
      isPending: false,
      isError: false,
      refetch: jest.fn(),
    };
  });

  it('renders the service center profile', async () => {
    await renderScreen();

    expect(screen.getByRole('header', { name: 'ТехноСервіс' })).toBeTruthy();
    expect(screen.getByText('СЕРВІСНИЙ ЦЕНТР · ID 1182')).toBeTruthy();
    expect(screen.getByText('Відчинено до 19:00')).toBeTruthy();

    expect(screen.getByText('Смартфони')).toBeTruthy();
    expect(screen.getByText('Ноутбуки')).toBeTruthy();
    expect(screen.getByText('Побутова техніка')).toBeTruthy();
    expect(screen.getByText('Телевізори')).toBeTruthy();

    expect(screen.getByText('Подзвонити')).toBeTruthy();
    expect(screen.getByText('ВІДГУКИ')).toBeTruthy();
    expect(screen.getByText('Олена Коваль')).toBeTruthy();
    expect(
      screen.getByText('Швидко та якісно відремонтували телефон.'),
    ).toBeTruthy();
    expect(mockReviewsCompanyId).toBe(MOCK_SERVICE_CENTER.id);
    expect(mockReviewsCompanyId).not.toBe(MOCK_SERVICE_CENTER.publicId);
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
  it('calls the phone action when the button is pressed', async () => {
    const onCall = jest.fn();

    await render(
      <ServiceCenterProfileView
        center={MOCK_SERVICE_CENTER}
        onBack={jest.fn()}
        onCall={onCall}
      />,
    );

    await fireEvent.press(screen.getByText('Подзвонити'));

    expect(onCall).toHaveBeenCalledTimes(1);
  });

  it('displays Sunday opening hours', async () => {
    const center = {
      ...MOCK_SERVICE_CENTER,
      openingHours: {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: { open: '11:00', close: '15:00' },
      },
    };

    await render(
      <ServiceCenterProfileView
        center={center}
        onBack={jest.fn()}
        onCall={jest.fn()}
      />,
    );

    expect(screen.getByText('Нд 11:00–15:00')).toBeTruthy();
  });

  it('displays weekdays with different opening hours separately', async () => {
    const center = {
      ...MOCK_SERVICE_CENTER,
      openingHours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '09:00', close: '19:00' },
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    };

    await render(
      <ServiceCenterProfileView
        center={center}
        onBack={jest.fn()}
        onCall={jest.fn()}
      />,
    );

    expect(screen.getByText('Пн 8:00–18:00 · Вт 9:00–19:00')).toBeTruthy();
  });
});
