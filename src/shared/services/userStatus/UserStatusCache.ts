import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStatus } from '@/shared/types/userStatus';

/**
 * Handles caching of user status data with AsyncStorage persistence
 */
export class UserStatusCache {
  private static readonly CACHE_KEY = 'user_status_map_cache_v1';

  /**
   * Load cached statuses from AsyncStorage
   */
  static async load(): Promise<UserStatus[] | null> {
    try {
      const raw = await AsyncStorage.getItem(this.CACHE_KEY);
      if (!raw) {
        return null;
      }

      const cachedStatuses: UserStatus[] = JSON.parse(raw);
      if (!Array.isArray(cachedStatuses) || cachedStatuses.length === 0) {
        return null;
      }

      return cachedStatuses;
    } catch (error) {
      console.warn('[UserStatusCache] Failed to load cache:', error);
      return null;
    }
  }

  /**
   * Persist statuses to AsyncStorage
   */
  static async save(statuses: UserStatus[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(statuses));
    } catch (error) {
      console.warn('[UserStatusCache] Failed to persist cache:', error);
    }
  }

  /**
   * Clear cached statuses
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn('[UserStatusCache] Failed to clear cache:', error);
    }
  }
}
