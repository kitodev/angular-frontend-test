import { Component, Input, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { TComment, TTopic } from '@api/models/topic.model';
import { PermissionService } from '@core/services/permission/permission.service';
import { AppActions } from '@core/store/states/app/app.actions';
import { AppState } from '@core/store/states/app/app.state';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  @Input({ required: true }) public topic!: TTopic;
  @Input({ required: true }) public comment!: TComment;

  private _store = inject(Store);
  private _permissionService = inject(PermissionService);
  private _toastrService = inject(ToastrService);

  public $currentUser = toSignal(this._store.select(AppState.getCurrentUser));

  public $currentUserPermissions = toSignal(this._store.select(AppState.getCurrentUserPermissions));

  public getRoleName = this._permissionService.getRoleName;

  public reply(): void {
    this._toastrService.error('It cannot be implemented due to API error');
  }

  public delete(): void {
    this._store
      .dispatch(
        new AppActions.DeleteComment({
          topicId: this.topic.id,
          commentId: this.comment.id,
        })
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Comment deleted successfully');
        },
        error: () => {
          this._toastrService.success('Operation failed: Delete comment');
        },
      });
  }
}
