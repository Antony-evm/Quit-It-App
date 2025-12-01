import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserStatus,
  UserStatusMap,
  UserStatusAction,
  UserStatusesResponse,
} from '@/shared/types/userStatus';
import { USER_STATUS_ACTIONS } from '@/shared/constants/userStatus';
import { getStatusAction } from '@/shared/utils/statusActionConfig';
import { fetchUserStatuses } from '@/shared/api/userStatusApi';
import { RootStackParamList } from '@/types/navigation';

type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export class UserStatusService {
  private static statusMap: UserStatusMap | null = null;
  private static readonly CACHE_KEY = 'user_status_map_cache_v1';

  /**
   * Initialize the status map by fetching statuses from the backend
   */
  static async initialize({ forceRefresh = false } = {}): Promise<void> {
    if (this.statusMap && !forceRefresh) {
      return;
    }

    if (!forceRefresh) {
      const cachedMap = await this.loadFromCache();
      if (cachedMap) {
        this.statusMap = cachedMap;
        void this.refreshFromNetwork().catch(error => {
          console.warn('[UserStatusService] Background refresh failed:', error);
        });
        return;
      }
    }

    await this.refreshFromNetwork();
  }

  /**
   * Build the status map with navigation actions using configuration
   */
  private static buildStatusMap(statuses: UserStatus[]): UserStatusMap {
    const map: UserStatusMap = {};

    statuses.forEach(status => {
      const action = getStatusAction(status);

      map[status.id] = {
        status,
        action,
      };
    });

    return map;
  }

  private static async refreshFromNetwork(): Promise<void> {
    const response: UserStatusesResponse = await fetchUserStatuses();
    const statuses = response.data.statuses;
    this.statusMap = this.buildStatusMap(statuses);
    await this.persistCache(statuses);
  }

  private static async loadFromCache(): Promise<UserStatusMap | null> {
    try {
      const raw = await AsyncStorage.getItem(this.CACHE_KEY);
      if (!raw) {
        return null;
      }

      const cachedStatuses: UserStatus[] = JSON.parse(raw);
      if (!Array.isArray(cachedStatuses) || cachedStatuses.length === 0) {
        return null;
      }

      return this.buildStatusMap(cachedStatuses);
    } catch (error) {
      return null;
    }
  }

  private static async persistCache(statuses: UserStatus[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(statuses));
    } catch (error) {
      console.warn('[UserStatusService] Failed to persist cache:', error);
    }
  }

  /**
   * Get action for a given user status ID
   */
  static getStatusAction(statusId: number): UserStatusAction | null {
    if (!this.statusMap) {
      console.warn(
        'UserStatusService not initialized. Call initialize() first.',
      );
      return null;
    }

    return this.statusMap[statusId]?.action || null;
  }

  /**
   * Get status details for a given user status ID
   */
  static getStatus(statusId: number): UserStatus | null {
    if (!this.statusMap) {
      console.warn(
        'UserStatusService not initialized. Call initialize() first.',
      );
      return null;
    }

    return this.statusMap[statusId]?.status || null;
  }

  /**
   * Check if the service has been initialized
   */
  static isInitialized(): boolean {
    return this.statusMap !== null;
  }

  /**
   * Execute navigation based on user status
   */
  static executeStatusAction(
    statusId: number,
    navigation: NativeStackNavigationProp<RootStackParamList, any>,
  ): void {
    const action = this.getStatusAction(statusId);
    const status = this.getStatus(statusId);

    if (!action || !status) {
      console.warn('[UserStatusService] No action found for status:', statusId);
      return;
    }

    switch (action.type) {
      case USER_STATUS_ACTIONS.NAVIGATE_TO_QUESTIONNAIRE:
        navigation.navigate('Questionnaire');
        break;
      case USER_STATUS_ACTIONS.NAVIGATE_TO_PAYWALL:
        navigation.navigate('Paywall');
        break;
      case USER_STATUS_ACTIONS.NAVIGATE_TO_HOME:
      case USER_STATUS_ACTIONS.PLACEHOLDER_CALL:
        navigation.navigate('Home');
        break;
    }
  }
}
