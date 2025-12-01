import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchFrequency, FrequencyData } from '../api/fetchFrequency';

export class FrequencyService {
  private static frequency: FrequencyData | null = null;
  private static readonly CACHE_KEY = 'frequency_cache_v1';
  private static readonly CACHE_EXPIRY_HOURS = 24; // Cache for 24 hours

  /**
   * Initialize the frequency data by fetching from cache or network
   */
  static async initialize({
    forceRefresh = false,
  }: {
    forceRefresh?: boolean;
  } = {}): Promise<void> {
    if (this.frequency && !forceRefresh) {
      return;
    }

    if (!forceRefresh) {
      const cachedFrequency = await this.loadFromCache();
      if (
        cachedFrequency &&
        !this.isCacheExpired(cachedFrequency.cacheTimestamp)
      ) {
        this.frequency = cachedFrequency.data;
        // Keep cache fresh in background without blocking
        void this.refreshFromNetwork().catch(error => {
          console.warn('[FrequencyService] Background refresh failed:', error);
        });
        return;
      }
    }

    await this.refreshFromNetwork();
  }

  /**
   * Get the current frequency data
   */
  static getFrequency(): FrequencyData | null {
    return this.frequency;
  }

  /**
   * Force refresh the frequency data from network
   */
  static async refresh(): Promise<FrequencyData> {
    await this.refreshFromNetwork();
    return this.frequency!;
  }

  private static async refreshFromNetwork(): Promise<void> {
    try {
      const frequency = await fetchFrequency();
      this.frequency = frequency;
      await this.persistCache(frequency);
    } catch (error) {
      console.error(
        '[FrequencyService] Failed to refresh from network:',
        error,
      );
      throw error;
    }
  }

  private static async loadFromCache(): Promise<{
    data: FrequencyData;
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
      console.warn('[FrequencyService] Failed to load from cache:', error);
      return null;
    }
  }

  private static async persistCache(frequency: FrequencyData): Promise<void> {
    try {
      const cacheData = {
        data: frequency,
        cacheTimestamp: Date.now(),
      };
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('[FrequencyService] Failed to persist cache:', error);
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
      this.frequency = null;
    } catch (error) {
      console.warn('[FrequencyService] Failed to clear cache:', error);
    }
  }
}
