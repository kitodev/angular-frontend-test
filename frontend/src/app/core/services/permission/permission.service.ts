import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EPermissions } from '@api/enums/permission.enum';
import { ERoles } from '@api/enums/role.enum';
import { AppActions } from '@core/store/states/app/app.actions';
import { AppState } from '@core/store/states/app/app.state';
import { Store } from '@ngxs/store';

export type TPermissions = Record<keyof typeof EPermissions, boolean>;

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private _store = inject(Store);

  private _$currentUser = toSignal(this._store.select(AppState.getCurrentUser));

  private _rolePermissions: Record<ERoles, EPermissions> = {
    [ERoles.Guests]: EPermissions.ReadComments,

    [ERoles.SilverUsers]: EPermissions.ReadComments | EPermissions.AddDeleteComments,

    [ERoles.GoldUsers]: EPermissions.ReadComments | EPermissions.AddDeleteComments | EPermissions.AddDeleteTopics,

    [ERoles.Administrators]:
      EPermissions.ReadComments |
      EPermissions.AddDeleteComments |
      EPermissions.AddDeleteTopics |
      EPermissions.DeleteOthersCommentsTopics,
  };

  /**
   * Check if the specific role has a specific permission using bitwise AND
   *
   * @param role - The user whose permissions are to be checked
   * @param permission - The permission to check for
   * @returns true if the user has the specified permission, false otherwise
   */
  public hasPermission(role: ERoles, permission: EPermissions): boolean {
    return (this._rolePermissions[role] & permission) === permission;
  }

  /**
   * Get role name by providing role level
   *
   * @param role - Role of user
   * @param isPlural - true if you want to get plural form of rule, false otherwise
   * @returns Name of role
   */
  public getRoleName(role: ERoles, isPlural = false): string {
    return isPlural ? ERoles[role] : ERoles[role].slice(0, -1);
  }

  /**
   * Get permissions of role
   *
   * @param role - Role of user
   * @returns Permissions of role
   */
  public getRolePermissions(role: ERoles): EPermissions {
    return this._rolePermissions[role];
  }

  /**
   * Update permissions os the selected role
   *
   * @param role - Role of user
   * @param permissions - Permissions to set
   */
  public updateRolePermissions(role: ERoles, permissions: EPermissions): void {
    this._rolePermissions[role] = permissions;
  }

  /**
   * Toggle a permission for a specific role
   *
   * @param role - The role for which to toggle the permission
   * @param permission - The permission to toggle
   */
  public togglePermission(role: ERoles, permission: EPermissions): void {
    this._rolePermissions[role] ^= permission;
    this._store.dispatch(new AppActions.SetCurrentUserPermissions(this._$currentUser()!));
  }
}
