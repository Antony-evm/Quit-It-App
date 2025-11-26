import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchQuestionnaireAccountData } from '@/features/questionnaire/api/fetchQuestionnaireAccountData';

/**
 * Service for managing questionnaire question IDs cache
 * Similar to UserStatusService and UserTypeService patterns
 * Question IDs rarely change and should be cached for performance
 */
export class QuestionnaireAccountService {
  private static questionIds: number[] | null = null;
  private static readonly CACHE_KEY = 'questionnaire_account_question_ids_v1';

  /**
   * Initialize the question IDs by fetching from backend or cache
   */
  static async initialize({ forceRefresh = false } = {}): Promise<void> {
    // Return early if already initialized and not forcing refresh
    if (this.questionIds && !forceRefresh) {
      return;
    }

    try {
      if (!forceRefresh) {
        // Try to load from cache first
        const cachedIds = await this.loadFromCache();
        if (cachedIds) {
          this.questionIds = cachedIds;
          return;
        }
      }

      // Cache miss or force refresh - fetch from network
      await this.refreshFromNetwork();
    } catch (error) {
      // If both cache and network fail, fallback to empty array
      this.questionIds = [];
      console.warn('Failed to initialize QuestionnaireAccountService:', error);
    }
  }

  private static async refreshFromNetwork(): Promise<void> {
    try {
      const questionIds = await fetchQuestionnaireAccountData();
      this.questionIds = questionIds;
      await this.persistCache(questionIds);
    } catch (error) {
      throw error;
    }
  }

  private static async loadFromCache(): Promise<number[] | null> {
    try {
      const raw = await AsyncStorage.getItem(this.CACHE_KEY);
      if (!raw) {
        return null;
      }

      const cachedIds: number[] = JSON.parse(raw);
      if (!Array.isArray(cachedIds)) {
        return null;
      }

      return cachedIds;
    } catch (error) {
      return null;
    }
  }

  private static async persistCache(questionIds: number[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(questionIds));
    } catch (error) {
      console.warn('Failed to persist questionnaire account cache:', error);
    }
  }

  /**
   * Get all cached question IDs
   */
  static getQuestionIds(): number[] {
    if (!this.questionIds) {
      console.warn(
        'QuestionnaireAccountService not initialized. Call initialize() first.',
      );
      return [];
    }

    return [...this.questionIds]; // Return a copy to prevent mutations
  }

  /**
   * Check if a specific question ID exists in cache
   */
  static hasQuestionId(questionId: number): boolean {
    return this.getQuestionIds().includes(questionId);
  }

  /**
   * Check if the service has been initialized
   */
  static isInitialized(): boolean {
    return this.questionIds !== null;
  }

  /**
   * Reset the service (useful for testing or re-initialization)
   */
  static reset(): void {
    this.questionIds = null;
  }

  /**
   * Force refresh from network
   */
  static async refresh(): Promise<void> {
    await this.initialize({ forceRefresh: true });
  }
}
