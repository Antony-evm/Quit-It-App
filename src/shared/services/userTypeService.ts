import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserType,
  UserTypeMap,
  UserTypesResponse,
} from '@/shared/types/userType';
import { fetchUserTypes } from '@/shared/api/userTypeApi';

export class UserTypeService {
  private static typeMap: UserTypeMap | null = null;
  private static readonly CACHE_KEY = 'user_type_map_cache_v1';

  /**
   * Initialize the type map by fetching types from the backend
   */
  static async initialize({ forceRefresh = false } = {}): Promise<void> {
    if (this.typeMap && !forceRefresh) {
      return;
    }

    if (!forceRefresh) {
      const cachedMap = await this.loadFromCache();
      if (cachedMap) {
        this.typeMap = cachedMap;
        void this.refreshFromNetwork().catch(error => {
          console.warn('[UserTypeService] Background refresh failed:', error);
        });
        return;
      }
    }

    await this.refreshFromNetwork();
  }

  /**
   * Build the type map
   */
  private static buildTypeMap(types: UserType[]): UserTypeMap {
    const map: UserTypeMap = {};

    if (!Array.isArray(types)) {
      return map;
    }

    types.forEach(type => {
      if (
        type &&
        typeof type.id === 'number' &&
        typeof type.code === 'string'
      ) {
        map[type.id] = type;
      }
    });

    return map;
  }

  private static async refreshFromNetwork(): Promise<void> {
    const response: UserTypesResponse = await fetchUserTypes();
    const types = response.data.types;
    this.typeMap = this.buildTypeMap(types);
    await this.persistCache(types);
  }

  private static async loadFromCache(): Promise<UserTypeMap | null> {
    try {
      const raw = await AsyncStorage.getItem(this.CACHE_KEY);
      if (!raw) {
        return null;
      }

      const cachedTypes: UserType[] = JSON.parse(raw);
      if (!Array.isArray(cachedTypes) || cachedTypes.length === 0) {
        return null;
      }

      return this.buildTypeMap(cachedTypes);
    } catch (error) {
      return null;
    }
  }

  private static async persistCache(types: UserType[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(types));
    } catch (error) {
      console.warn('[UserTypeService] Failed to persist cache:', error);
    }
  }

  /**
   * Get type details for a given user type ID
   */
  static getType(typeId: number): UserType | null {
    if (!this.typeMap) {
      console.warn('UserTypeService not initialized. Call initialize() first.');
      return null;
    }

    return this.typeMap[typeId] || null;
  }

  /**
   * Get type by code
   */
  static getTypeByCode(code: string): UserType | null {
    if (!this.typeMap) {
      console.warn('UserTypeService not initialized. Call initialize() first.');
      return null;
    }

    return (
      Object.values(this.typeMap).find(
        (type: UserType) => type.code === code,
      ) || null
    );
  }

  /**
   * Get all available types
   */
  static getAllTypes(): UserType[] {
    if (!this.typeMap) {
      console.warn('UserTypeService not initialized. Call initialize() first.');
      return [];
    }

    return Object.values(this.typeMap);
  }

  /**
   * Check if service is initialized
   */
  static isInitialized(): boolean {
    return this.typeMap !== null;
  }

  /**
   * Reset the service (useful for testing or re-initialization)
   */
  static reset(): void {
    this.typeMap = null;
  }
}
