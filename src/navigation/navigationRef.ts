import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function resetNavigation(
  routeName: keyof RootStackParamList,
  params?: object,
) {
  if (!navigationRef.isReady()) {
    return false;
  }

  navigationRef.reset({
    index: 0,
    routes: [{ name: routeName, ...(params && { params }) }],
  });
  return true;
}
