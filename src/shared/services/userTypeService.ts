import {
  UserType,
  UserTypeMap,
  UserTypesResponse,
} from '@/shared/types/userType';
import { fetchUserTypes } from '@/shared/api/userTypeApi';

export class UserTypeService {
  private static typeMap: UserTypeMap | null = null;

  /**
   * Initialize the type map by fetching types from the backend
   */
  static async initialize(): Promise<void> {
    try {
      const response: UserTypesResponse = await fetchUserTypes();
      this.typeMap = this.buildTypeMap(response.data.types);
    } catch (error) {
      console.error('Failed to initialize user type service:', error);
      throw error;
    }
  }

  /**
   * Build the type map
   */
  private static buildTypeMap(types: UserType[]): UserTypeMap {
    const map: UserTypeMap = {};

    types.forEach(type => {
      map[type.id] = type;
    });

    return map;
  }

  /**
   * Get type details for a given user type ID
   */
  static getType(typeId: number): UserType | null {
    if (!this.typeMap) {
      console.warn(
        'UserTypeService not initialized. Call initialize() first.',
      );
      return null;
    }

    return this.typeMap[typeId] || null;
  }

  /**
   * Get type by code
   */
  static getTypeByCode(code: string): UserType | null {
    if (!this.typeMap) {
      console.warn(
        'UserTypeService not initialized. Call initialize() first.',
      );
      return null;
    }

    return Object.values(this.typeMap).find((type: UserType) => type.code === code) || null;
  }

  /**
   * Get all available types
   */
  static getAllTypes(): UserType[] {
    if (!this.typeMap) {
      console.warn(
        'UserTypeService not initialized. Call initialize() first.',
      );
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