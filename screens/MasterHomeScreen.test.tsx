import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MOCK_MASTER_REQUESTS } from '../src/api/masterRequests';
import { MOCK_VOLUNTEER_REQUESTS } from '../src/api/volunteer';
import {
  MasterHomeView,
  RESPOND_ERROR,
  newRequestsTitle,
  type MasterHomeViewProps,
} from './MasterHomeScreen';

const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function props(overrides: Partial<MasterHomeViewProps> = {}): MasterHomeViewProps {
  return {
    firstName: 'Андрій',
    now: new Date(2026, 10, 27, 9, 0),
    requests: MOCK_MASTER_REQUESTS,
    requestsState: 'ready',
    categories: [{ id: 1, name: 'Побутова техніка', parentId: null }],
    onRetryRequests: jest.fn(),
    onAccept: jest.fn(),
    onDecline: jest.fn(),
    showVolunteer: true,
    volunteerRequests: MOCK_VOLUNTEER_REQUESTS,
    volunteerState: 'ready',
    onRetryVolunteer: jest.fn(),
    ...overrides,
  };
}

async function renderView(overrides: Partial<MasterHomeViewProps> = {}) {
  const viewProps = props(overrides);
  await render(
    <SafeAreaProvider initialMetrics={METRICS}>
      <MasterHomeView {...viewProps} />
    </SafeAreaProvider>,
  );
  return viewProps;
}

describe('newRequestsTitle', () => {
  it('uses Ukrainian plural forms', () => {
    expect(newRequestsTitle(0)).toBe('Нових заявок немає');
    expect(newRequestsTitle(1)).toBe('1 нова заявка');
    expect(newRequestsTitle(3)).toBe('3 нові заявки');
    expect(newRequestsTitle(5)).toBe('5 нових заявок');
    expect(newRequestsTitle(21)).toBe('21 нова заявка');
  });
});

describe('MasterHomeView', () => {
  it('greets by the time of day and counts new requests', async () => {
    await renderView();

    expect(screen.getByText('Доброго ранку, Андрію')).toBeTruthy();
    expect(screen.getByRole('header', { name: '2 нові заявки' })).toBeTruthy();
  });

  it('shows each request with the client, district and time', async () => {
    await renderView();

    expect(screen.getByText('Пральна машина не зливає воду')).toBeTruthy();
    expect(screen.getByText('Олександр · Сихів · 10 хв тому')).toBeTruthy();
    expect(screen.getByText('Марія · Центр · 1 год тому')).toBeTruthy();
    expect(screen.getAllByText('Побутова техніка')).toHaveLength(2);
  });

  it('accepts and declines a request', async () => {
    const viewProps = await renderView();

    await fireEvent.press(screen.getAllByText('Прийняти')[0]);
    await fireEvent.press(screen.getAllByText('Відхилити')[1]);

    expect(viewProps.onAccept).toHaveBeenCalledWith(41);
    expect(viewProps.onDecline).toHaveBeenCalledWith(42);
  });

  it('shows the empty state', async () => {
    await renderView({ requests: [] });

    expect(screen.getByRole('header', { name: 'Нових заявок немає' })).toBeTruthy();
    expect(screen.getByText('Щойно клієнт надішле вам заявку, вона зʼявиться тут.')).toBeTruthy();
  });

  it('retries after a loading error', async () => {
    const viewProps = await renderView({ requests: [], requestsState: 'error' });

    await fireEvent.press(screen.getByText('Не вдалося завантажити заявки'));
    await fireEvent.press(screen.getAllByText('Спробувати ще раз')[0]);

    expect(viewProps.onRetryRequests).toHaveBeenCalled();
  });

  it('shows an error when a decision fails', async () => {
    await renderView({ actionError: RESPOND_ERROR });

    expect(screen.getByText(RESPOND_ERROR)).toBeTruthy();
  });

  it('shows nearby volunteer requests to a volunteer', async () => {
    await renderView();

    expect(screen.getByText('Волонтерські запити поруч')).toBeTruthy();
    expect(screen.getByText('Полагодити обігрівачі в притулку')).toBeTruthy();
  });

  it('hides the volunteer block from other masters', async () => {
    await renderView({ showVolunteer: false });

    expect(screen.queryByText('Волонтерські запити поруч')).toBeNull();
    expect(screen.queryByText('Полагодити обігрівачі в притулку')).toBeNull();
  });

  it('asks for a city instead of showing requests from everywhere', async () => {
    const onFillCity = jest.fn();
    await renderView({ volunteerNeedsCity: true, volunteerRequests: [], onFillCity });

    expect(
      screen.getByText('Вкажіть місто в профілі, щоб бачити волонтерські запити поруч.'),
    ).toBeTruthy();
    expect(screen.queryByText('Полагодити обігрівачі в притулку')).toBeNull();

    await fireEvent.press(screen.getByText('Заповнити'));

    expect(onFillCity).toHaveBeenCalled();
  });
});
