import { Button } from '../components/Button';
import { useAuth } from '../src/auth/AuthProvider';
import TabPlaceholderScreen from './TabPlaceholderScreen';
import ClientHomeScreen from './ClientHomeScreen';
import RequestsScreen from './RequestsScreen';

export function HomeTabScreen() {
  const { state } = useAuth();
  const role = state.status === 'signedIn' ? state.user.role : null;

  if (role === 'client') {
    return <ClientHomeScreen />;
  }

  if (role === 'master') {
    return <TabPlaceholderScreen title="Головна майстра" />;
  }

  return <TabPlaceholderScreen title="Головний екран" />;
}

export function RequestsTabScreen() {
  const { state } = useAuth();
  const role = state.status === 'signedIn' ? state.user.role : null;

  if (role === 'client') {
    return <RequestsScreen />;
  }

  return <TabPlaceholderScreen title="Мої заявки" />;
}

export function ChatsTabScreen() {
  return <TabPlaceholderScreen title="Список чатів" />;
}

export function ProfileTabScreen() {
  const { signOut } = useAuth();

  return (
    <TabPlaceholderScreen title="Мій профіль">
      <Button
        label="Вийти"
        variant="secondary"
        onPress={() => void signOut()}
      />
    </TabPlaceholderScreen>
  );
}
