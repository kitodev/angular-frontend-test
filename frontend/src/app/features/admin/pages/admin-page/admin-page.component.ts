import { Component, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { EPermissions } from '@api/enums/permission.enum';
import { ERoles } from '@api/enums/role.enum';
import { arrayFromObject } from '@shared/helpers/enum-to-array';
import { PermissionService, TPermissions } from '@core/services/permission/permission.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleNameDialogComponent } from '@shared/dialogs/edit-role-name-dialog/edit-role-name-dialog.component';
import { TRole, TUpdateRole } from '@api/models/role.model';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppState } from '@core/store/states/app/app.state';
import { AppActions } from '@core/store/states/app/app.actions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnInit {
  private _store = inject(Store);
  private _dialog = inject(MatDialog);
  private _toastrService = inject(ToastrService);

  public permissionService = inject(PermissionService);

  public $roles = toSignal(this._store.select(AppState.getRoles));

  public roles = arrayFromObject(ERoles);
  public permissions = arrayFromObject(EPermissions);

  public currentRole!: ERoles;
  public currentRolePermissions!: TPermissions;

  ngOnInit(): void {
    this._initRolePermissions(ERoles.Administrators);
  }

  public changeRole(event: MatSelectChange): void {
    this._initRolePermissions(event.value);
  }

  public updatePermission(change: MatCheckboxChange, role: ERoles, permission: EPermissions): void {
    change.source.toggle();
    this.permissionService.togglePermission(role, permission);
  }

  public editRoleName(): void {
    const currentRole = this.$roles()![this.currentRole];

    this._dialog
      .open<EditRoleNameDialogComponent, TRole, TUpdateRole>(EditRoleNameDialogComponent, {
        width: '500px',
        data: currentRole,
      })
      .afterClosed()
      .subscribe({
        next: (role) => {
          if (role) {
            this._store.dispatch(new AppActions.UpdateRole(role)).subscribe({
              next: () => {
                this._toastrService.success('Role updated successfully');
              },
              error: () => {
                this._toastrService.error('Operation failed: Update role');
              },
            });
          }
        },
      });
  }

  private _initRolePermissions(role: ERoles): void {
    this.currentRole = role;

    const rolePermissions = this.permissionService.getRolePermissions(this.currentRole);

    this.currentRolePermissions = {
      ReadComments: (rolePermissions & EPermissions.ReadComments) !== 0,
      AddDeleteComments: (rolePermissions & EPermissions.AddDeleteComments) !== 0,
      AddDeleteTopics: (rolePermissions & EPermissions.AddDeleteTopics) !== 0,
      DeleteOthersCommentsTopics: (rolePermissions & EPermissions.DeleteOthersCommentsTopics) !== 0,
    };
  }
}
