import { Component, Input, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { TComment, TCreateComment, TTopic } from '@api/models/topic.model';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { AppState } from '@core/store/states/app/app.state';
import { AppActions } from '@core/store/states/app/app.actions';
import { ToastrService } from 'ngx-toastr';
import { AddCommentDialogComponent } from '@shared/dialogs/add-comment-dialog/add-comment-dialog.component';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    CommentsComponent,
    CommentComponent,
    MatExpansionModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent {
  @Input({ required: true }) public topic!: TTopic;
  @Input({ required: true }) public comments!: TComment[];
  @Input() public nestedLevel = 0;

  private _store = inject(Store);
  private _dialog = inject(MatDialog);
  private _toastrService = inject(ToastrService);

  public $currentUserPermissions = toSignal(this._store.select(AppState.getCurrentUserPermissions));

  public get filteredComments(): TComment[] {
    return this.comments.filter((comment) => !comment.removed);
  }

  public addComment(commentId?: string): void {
    this._dialog
      .open<AddCommentDialogComponent, any, TCreateComment>(AddCommentDialogComponent, { width: '500px' })
      .afterClosed()
      .subscribe({
        next: (comment) => {
          if (comment) {
            if (this.nestedLevel === 0) {
              this._store
                .dispatch(
                  new AppActions.AddCommentToTopic({
                    topicId: this.topic.id,
                    comment,
                  })
                )
                .subscribe({
                  next: () => {
                    this._toastrService.success('Comment added successfully');
                  },
                  error: () => {
                    this._toastrService.error('Operation failed: Add comment');
                  },
                });
            } else if (this.nestedLevel !== 0 && commentId) {
              this._toastrService.error('It cannot be implemented due to API error');
              this._store.dispatch(
                new AppActions.AddCommentToComment({
                  topicId: this.topic.id,
                  commentId,
                  comment,
                })
              );
            }
          }
        },
      });
  }
}
