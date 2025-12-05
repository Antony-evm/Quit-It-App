import { UserStatus, UserStatusMap, UserStatusAction } from '@/shared/types/userStatus';
import { getStatusAction } from '@/shared/utils/statusActionConfig';

/**
 * Handles mapping of user statuses to their associated actions
 */
export class UserStatusMapper {
  /**
   * Build the status map with navigation actions from status array
   */
  static buildStatusMap(statuses: UserStatus[]): UserStatusMap {
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

  /**
   * Get action for a specific status ID from the map
   */
  static getAction(
    statusMap: UserStatusMap | null,
    statusId: number,
  ): UserStatusAction | null {
    if (!statusMap) {
      return null;
    }
    return statusMap[statusId]?.action || null;
  }

  /**
   * Get status details for a specific status ID from the map
   */
  static getStatus(
    statusMap: UserStatusMap | null,
    statusId: number,
  ): UserStatus | null {
    if (!statusMap) {
      return null;
    }
    return statusMap[statusId]?.status || null;
  }
}
