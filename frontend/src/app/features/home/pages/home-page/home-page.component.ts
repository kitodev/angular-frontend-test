import { Component, ViewChild, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppState } from '@core/store/states/app/app.state';
import { Store } from '@ngxs/store';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TTopic } from '@api/models/topic.model';
import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { CommentsComponent } from '@features/home/components/comments/comments.component';
import { AppActions } from '@core/store/states/app/app.actions';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from '@core/services/permission/permission.service';

type TAddTopicForm = Omit<TTopic, 'id' | 'comments' | 'author'>;

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    CommentsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  @ViewChild(MatAccordion) public matAccordion!: MatAccordion;

  private _store = inject(Store);
  private _toastrService = inject(ToastrService);
  private _permissionService = inject(PermissionService);

  public $topics = toSignal(this._store.select(AppState.getTopics));
  public $currentUser = toSignal(this._store.select(AppState.getCurrentUser));

  public $currentUserPermissions = toSignal(this._store.select(AppState.getCurrentUserPermissions));

  public getRoleName = this._permissionService.getRoleName;

  public addTopicForm = new FormGroup<ControlsOf<TAddTopicForm>>({
    title: new FormControl<string>('', Validators.required),
    body: new FormControl<string>('', Validators.required),
  });

  public addTopic(): void {
    const currentUser = this.$currentUser()!;

    this._store
      .dispatch(
        new AppActions.AddTopic({
          ...this.addTopicForm.value,
          author: currentUser,
        })
      )
      .subscribe({
        next: () => {
          this.matAccordion.closeAll();
          this._toastrService.success('Topic added successfully');
        },
        error: () => {
          this._toastrService.error('Operation failed: Add topic');
        },
      });
  }

  public deleteTopic(topicId: string): void {
    this._store.dispatch(new AppActions.DeleteTopic(topicId)).subscribe({
      next: () => {
        this.matAccordion.closeAll();
        this._toastrService.success('Topic deleted successfully');
      },
      error: () => {
        this._toastrService.error('Operation failed: Delete topic');
      },
    });
  }
}
