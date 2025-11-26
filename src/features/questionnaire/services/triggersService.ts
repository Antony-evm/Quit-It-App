import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTriggers } from '../api/fetchTriggers';

export class TriggersService {
  private static triggers: string[] | null = null;
  private static readonly CACHE_KEY = 'triggers_cache_v1';
  private static readonly CACHE_EXPIRY_HOURS = 24; // Cache for 24 hours

  /**
   * Initialize the triggers by fetching from cache or network
   */
  static async initialize({
    userId,
    forceRefresh = false,
  }: {
    userId: number;
    forceRefresh?: boolean;
  }): Promise<void> {
    if (this.triggers && !forceRefresh) {
      return;
    }

    if (!forceRefresh) {
      const cachedTriggers = await this.loadFromCache();
      if (
        cachedTriggers &&
        !this.isCacheExpired(cachedTriggers.cacheTimestamp)
      ) {
        this.triggers = cachedTriggers.data;
        // Keep cache fresh in background without blocking
        void this.refreshFromNetwork(userId).catch(error => {
          console.warn('[TriggersService] Background refresh failed:', error);
        });
        return;
      }
    }

    await this.refreshFromNetwork(userId);
  }

  /**
   * Get the current triggers
   */
  static getTriggers(): string[] | null {
    return this.triggers;
  }

  /**
   * Force refresh the triggers from network
   */
  static async refresh(userId: number): Promise<string[]> {
    await this.refreshFromNetwork(userId);
    return this.triggers!;
  }

  private static async refreshFromNetwork(userId: number): Promise<void> {
    try {
      const triggers = await fetchTriggers(userId);
      this.triggers = triggers;
      await this.persistCache(triggers);
    } catch (error) {
      console.error('[TriggersService] Failed to refresh from network:', error);
      throw error;
    }
  }

  private static async loadFromCache(): Promise<{
    data: string[];
    cacheTimestamp: number;
  } | null> {
    try {
      const raw = await AsyncStorage.getItem(this.CACHE_KEY);
      if (!raw) {
        return null;
      }

      const cached = JSON.parse(raw);
      return cached;
    } catch (error) {
      console.warn('[TriggersService] Failed to load from cache:', error);
      return null;
    }
  }

  private static async persistCache(triggers: string[]): Promise<void> {
    try {
      const cacheData = {
        data: triggers,
        cacheTimestamp: Date.now(),
      };
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('[TriggersService] Failed to persist cache:', error);
      // Don't throw - caching is not critical
    }
  }

  private static isCacheExpired(cacheTimestamp: number): boolean {
    const now = Date.now();
    const expiryMs = this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
    return now - cacheTimestamp > expiryMs;
  }

  /**
   * Clear the cache and in-memory data
   */
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHE_KEY);
      this.triggers = null;
    } catch (error) {
      console.warn('[TriggersService] Failed to clear cache:', error);
    }
  }
}
