import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuittingPlan } from '../types/plan';
import { fetchQuittingPlan } from '../api/fetchQuittingPlan';

export class QuittingPlanService {
  private static plan: QuittingPlan | null = null;
  private static readonly CACHE_KEY = 'quitting_plan_cache_v1';
  private static readonly CACHE_EXPIRY_HOURS = 24; // Cache for 24 hours

  /**
   * Initialize the quitting plan by fetching from cache or network
   */
  static async initialize({
    userId,
    forceRefresh = false,
  }: {
    userId: number;
    forceRefresh?: boolean;
  }): Promise<void> {
    if (this.plan && !forceRefresh) {
      return;
    }

    if (!forceRefresh) {
      const cachedPlan = await this.loadFromCache();
      if (cachedPlan && !this.isCacheExpired(cachedPlan.cacheTimestamp)) {
        this.plan = cachedPlan.data;
        // Keep cache fresh in background without blocking
        void this.refreshFromNetwork(userId).catch(error => {
          console.warn(
            '[QuittingPlanService] Background refresh failed:',
            error,
          );
        });
        return;
      }
    }

    await this.refreshFromNetwork(userId);
  }

  /**
   * Get the current quitting plan
   */
  static getPlan(): QuittingPlan | null {
    return this.plan;
  }

  /**
   * Force refresh the plan from network
   */
  static async refresh(userId: number): Promise<QuittingPlan> {
    await this.refreshFromNetwork(userId);
    return this.plan!;
  }

  private static async refreshFromNetwork(userId: number): Promise<void> {
    try {
      const plan = await fetchQuittingPlan(userId);
      this.plan = plan;
      await this.persistCache(plan);
    } catch (error) {
      console.error(
        '[QuittingPlanService] Failed to refresh from network:',
        error,
      );
      throw error;
    }
  }

  private static async loadFromCache(): Promise<{
    data: QuittingPlan;
    cacheTimestamp: number;
  } | null> {
    try {
      const raw = await AsyncStorage.getItem(this.CACHE_KEY);
      if (!raw) {
        return null;
      }

      const cached = JSON.parse(raw);

      // Convert date string back to Date object
      if (cached.data && cached.data.date) {
        cached.data.date = new Date(cached.data.date);
      }

      return cached;
    } catch (error) {
      console.warn('[QuittingPlanService] Failed to load from cache:', error);
      return null;
    }
  }

  private static async persistCache(plan: QuittingPlan): Promise<void> {
    try {
      const cacheData = {
        data: plan,
        cacheTimestamp: Date.now(),
      };
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('[QuittingPlanService] Failed to persist cache:', error);
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
      this.plan = null;
    } catch (error) {
      console.warn('[QuittingPlanService] Failed to clear cache:', error);
    }
  }
}
