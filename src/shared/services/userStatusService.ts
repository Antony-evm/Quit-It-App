import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  UserStatus,
  UserStatusMap,
  UserStatusAction,
  UserStatusesResponse,
} from '@/shared/types/userStatus';
import { fetchUserStatuses } from '@/shared/api/userStatusApi';
import { RootStackParamList } from '@/types/navigation';
import { UserStatusCache } from './userStatus/UserStatusCache';
import { UserStatusMapper } from './userStatus/UserStatusMapper';
import { UserStatusNavigator } from './userStatus/UserStatusNavigator';

/**
 * Facade service for managing user status data and navigation
 * Delegates to specialized classes for cache, mapping, and navigation
 */
export class UserStatusService {
  private static statusMap: UserStatusMap | null = null;

  /**
   * Initialize the status map by fetching statuses from the backend
   * Uses cache-first strategy with background refresh
   */
  static async initialize({ forceRefresh = false } = {}): Promise<void> {
    if (this.statusMap && !forceRefresh) {
      return;
    }

    if (!forceRefresh) {
      const cachedStatuses = await UserStatusCache.load();
      if (cachedStatuses) {
        this.statusMap = UserStatusMapper.buildStatusMap(cachedStatuses);
        // Background refresh without blocking
        void this.refreshFromNetwork().catch(error => {
          console.warn('[UserStatusService] Background refresh failed:', error);
        });
        return;
      }
    }

    await this.refreshFromNetwork();
  }

  /**
   * Refresh status map from network and persist to cache
   */
  private static async refreshFromNetwork(): Promise<void> {
    const response: UserStatusesResponse = await fetchUserStatuses();
    const statuses = response.data.statuses;
    this.statusMap = UserStatusMapper.buildStatusMap(statuses);
    await UserStatusCache.save(statuses);
  }

  /**
   * Get action for a given user status ID
   */
  static getStatusAction(statusId: number): UserStatusAction | null {
    if (!this.statusMap) {
      console.warn(
        '[UserStatusService] Not initialized. Call initialize() first.',
      );
      return null;
    }

    return UserStatusMapper.getAction(this.statusMap, statusId);
  }

  /**
   * Get status details for a given user status ID
   */
  static getStatus(statusId: number): UserStatus | null {
    if (!this.statusMap) {
      console.warn(
        '[UserStatusService] Not initialized. Call initialize() first.',
      );
      return null;
    }

    return UserStatusMapper.getStatus(this.statusMap, statusId);
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
    navigation: NativeStackNavigationProp<
      RootStackParamList,
      keyof RootStackParamList
    >,
  ): void {
    const action = this.getStatusAction(statusId);
    const status = this.getStatus(statusId);

    if (!action || !status) {
      console.warn('[UserStatusService] No action found for status:', statusId);
      return;
    }

    UserStatusNavigator.executeAction(action, navigation);
  }

  /**
   * Clear the status map and cache
   */
  static async clear(): Promise<void> {
    this.statusMap = null;
    await UserStatusCache.clear();
  }
}
