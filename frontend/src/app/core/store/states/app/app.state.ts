import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { TComment, TTopic } from '@api/models/topic.model';
import { TRole } from '@api/models/role.model';
import { TUser } from '@api/models/user.model';
import { isEqual, some } from 'lodash-es';
import { ApiService } from '@core/services/api/api.service';
import { of, tap } from 'rxjs';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { PermissionService, TPermissions } from '@core/services/permission/permission.service';
import { EPermissions } from '@api/enums/permission.enum';
import { AppActions } from './app.actions';

export type AppStateModel = {
  roles: TRole[];
  topics: TTopic[];
  users: TUser[];
  currentUser?: TUser;
  currentUserPermissions: TPermissions;
  currentUserTopicsCount?: number;
  currentUserCommentsCount?: number;
};

const defaults: AppStateModel = {
  roles: [],
  topics: [],
  users: [],
  currentUser: undefined,
  currentUserPermissions: {
    ReadComments: false,
    AddDeleteComments: false,
    AddDeleteTopics: false,
    DeleteOthersCommentsTopics: false,
  },
  currentUserTopicsCount: undefined,
  currentUserCommentsCount: undefined,
};

@State<AppStateModel>({
  name: AppState.STATE_KEY,
  defaults,
})
@Injectable()
export class AppState {
  public static STATE_KEY = 'app';

  private _apiService = inject(ApiService);
  private _permissionService = inject(PermissionService);

  @Action(AppActions.InitStore)
  public initStore(context: StateContext<AppStateModel>, action: AppActions.InitStore) {
    const { roles, topics, users } = action.payload.data;
    const state = context.getState();

    const previousUserFound = some(users, (user) => isEqual(user, state.currentUser));
    const currentUser = previousUserFound ? state.currentUser! : users[0];

    context.setState({
      roles,
      topics,
      users,
      currentUser,
      currentUserPermissions: state.currentUserPermissions,
    });

    context.dispatch([
      new AppActions.CountCurrentUserTopicsComments(),
      new AppActions.SetCurrentUserPermissions(currentUser),
    ]);
  }

  @Action(AppActions.SetCurrentUserPermissions)
  public setUserPermissions(context: StateContext<AppStateModel>, action: AppActions.SetCurrentUserPermissions) {
    context.patchState({
      currentUserPermissions: {
        AddDeleteComments: this._permissionService.hasPermission(action.payload.role, EPermissions.AddDeleteComments),
        AddDeleteTopics: this._permissionService.hasPermission(action.payload.role, EPermissions.AddDeleteTopics),
        DeleteOthersCommentsTopics: this._permissionService.hasPermission(
          action.payload.role,
          EPermissions.DeleteOthersCommentsTopics
        ),
        ReadComments: this._permissionService.hasPermission(action.payload.role, EPermissions.ReadComments),
      },
    });
  }

  @Action(AppActions.ChangeUser)
  public changeUser(context: StateContext<AppStateModel>, action: AppActions.ChangeUser) {
    context.patchState({
      currentUser: action.payload,
    });

    const { currentUser } = context.getState();

    context.dispatch([
      new AppActions.CountCurrentUserTopicsComments(),
      new AppActions.SetCurrentUserPermissions(currentUser!),
    ]);
  }

  @Action(AppActions.AddTopic)
  public addTopic(context: StateContext<AppStateModel>, action: AppActions.AddTopic) {
    return this._apiService.addTopic(action.payload).pipe(
      tap((response) => {
        context.setState(
          patch<AppStateModel>({
            topics: append([response.data]),
          })
        );

        context.dispatch(new AppActions.CountCurrentUserTopicsComments());
      })
    );
  }

  @Action(AppActions.DeleteTopic)
  public deleteTopic(context: StateContext<AppStateModel>, action: AppActions.DeleteTopic) {
    return this._apiService.deleteTopic(action.payload).pipe(
      tap(() => {
        context.setState(
          patch<AppStateModel>({
            topics: removeItem((topic) => topic.id === action.payload),
          })
        );

        context.dispatch(new AppActions.CountCurrentUserTopicsComments());
      })
    );
  }

  @Action(AppActions.AddCommentToTopic)
  public addCommentToTopic(context: StateContext<AppStateModel>, action: AppActions.AddCommentToTopic) {
    const { topicId, comment } = action.payload;

    return this._apiService.addCommentToTopic(topicId, comment).pipe(
      tap((response) => {
        const { topics } = context.getState();

        const selectedTopic = topics.find((topic) => topic.id === topicId)!;
        selectedTopic.comments.push(response.data);

        context.setState(
          patch<AppStateModel>({
            topics: updateItem((topic) => topic.id === topicId, selectedTopic),
          })
        );

        context.dispatch(new AppActions.CountCurrentUserTopicsComments());
      })
    );
  }

  @Action(AppActions.AddCommentToComment)
  public addCommentToComment(context: StateContext<AppStateModel>, action: AppActions.AddCommentToComment) {
    const { topicId, commentId, comment } = action.payload;

    return this._apiService.addCommentToComment(topicId, commentId, comment).pipe(
      tap((response) => {
        const { topics } = context.getState();

        const selectedTopic = topics.find((topic) => topic.id === topicId)!;
        const selectedComment = this._findCommentById(selectedTopic.comments, commentId)!;

        selectedComment.comments.push(response.data);

        // context.setState(
        //   patch<AppStateModel>({
        //     topics: updateItem(
        //       (topic) => topic.id === topicId,
        //       selectedTopic
        //     ),
        //   })
        // );

        context.dispatch(new AppActions.CountCurrentUserTopicsComments());
      })
    );
  }

  @Action(AppActions.DeleteComment)
  public deleteComment(context: StateContext<AppStateModel>, action: AppActions.DeleteComment) {
    const { topicId, commentId } = action.payload;

    return this._apiService.deleteComment(topicId, commentId).pipe(
      tap(() => {
        const { topics } = context.getState();
        const selectedTopic = topics.find((topic) => topic.id === topicId)!;

        selectedTopic.comments = this._removeCommentById(selectedTopic.comments, commentId);

        context.setState(
          patch<AppStateModel>({
            topics: updateItem((topic) => topic.id === topicId, selectedTopic),
          })
        );

        context.dispatch(new AppActions.CountCurrentUserTopicsComments());
      })
    );
  }

  @Action(AppActions.UpdateUser)
  public updateUser(context: StateContext<AppStateModel>, action: AppActions.UpdateUser) {
    return this._apiService.updateUser(action.payload).pipe(
      tap((response) => {
        context.setState(
          patch<AppStateModel>({
            users: updateItem((user) => user.id === action.payload.id, response.data),
          })
        );
      })
    );
  }

  @Action(AppActions.UpdatePassword)
  public updatePassword(context: StateContext<AppStateModel>, action: AppActions.UpdatePassword) {
    const { currentUser } = context.getState();
    const { user, password, confirmPassword } = action.payload;

    if (currentUser?.password !== password) {
      return this._apiService.updatePassword(user, password, confirmPassword).pipe(
        tap(() => {
          const newUser = user;
          newUser.password = password;

          context.setState(
            patch<AppStateModel>({
              users: updateItem((userObj) => userObj.id === user.id, newUser),
            })
          );
        })
      );
    }

    return of();
  }

  @Action(AppActions.CountCurrentUserTopicsComments)
  public countCurrentUserTopicsComments(context: StateContext<AppStateModel>) {
    const { currentUser, topics } = context.getState();

    context.patchState({
      currentUserTopicsCount: this._countTopicsByUser(currentUser!, topics),
      currentUserCommentsCount: this._countCommentsInTopicsByUser(currentUser!, topics),
    });
  }

  @Action(AppActions.UpdateRole)
  public updateRole(context: StateContext<AppStateModel>, action: AppActions.UpdateRole) {
    return this._apiService.updateRole(action.payload).pipe(
      tap((response) => {
        context.setState(
          patch<AppStateModel>({
            roles: updateItem((role) => role.id === response.data.id, response.data),
          })
        );
      })
    );
  }

  @Selector()
  public static getRoles(state: AppStateModel): TRole[] {
    return state.roles;
  }

  @Selector()
  public static getTopics(state: AppStateModel): TTopic[] {
    return state.topics;
  }

  @Selector()
  public static getUsers(state: AppStateModel): TUser[] {
    return state.users;
  }

  @Selector()
  public static getCurrentUser(state: AppStateModel): TUser | undefined {
    return state.currentUser;
  }

  @Selector()
  public static getCurrentUserPermissions(state: AppStateModel): TPermissions {
    return state.currentUserPermissions;
  }

  @Selector()
  public static getCurrentUserTopicsCount(state: AppStateModel): number | undefined {
    return state.currentUserTopicsCount;
  }

  @Selector()
  public static getCurrentUserCommentsCount(state: AppStateModel): number | undefined {
    return state.currentUserCommentsCount;
  }

  private _findCommentById(comments: TComment[], commentId: string): TComment | undefined {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }

      if (comment.comments.length) {
        const foundComment = this._findCommentById(comment.comments, commentId);

        if (foundComment) {
          return foundComment;
        }
      }
    }

    return undefined;
  }

  private _removeCommentById(comments: TComment[], commentId: string): TComment[] {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, removed: true };
      }

      if (comment.comments.length) {
        return {
          ...comment,
          comments: this._removeCommentById(comment.comments, commentId),
        };
      }

      return comment;
    });
  }

  private _countTopicsByUser(user: TUser, topics: TTopic[]): number {
    return topics.filter((topic) => topic.author.id === user.id).length;
  }

  private _countCommentsInTopicsByUser(user: TUser, topics: TTopic[]): number {
    let totalCommentsCount = 0;

    topics.forEach((topic) => {
      totalCommentsCount += this._countUserComments(user, topic.comments);
    });

    return totalCommentsCount;
  }

  private _countUserComments(user: TUser, comments: TComment[]): number {
    return comments.reduce((count, comment) => {
      let userCommentCount = count;

      if (comment.author.id === user.id) {
        userCommentCount += 1;
      }

      if (comment.comments.length) {
        userCommentCount += this._countUserComments(user, comment.comments);
      }

      return userCommentCount;
    }, 0);
  }
}
