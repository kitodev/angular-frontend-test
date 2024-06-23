import { TInitialApiResponse } from '@api/models/response.model';
import { TUpdateRole } from '@api/models/role.model';
import { TCreateComment, TCreateTopic } from '@api/models/topic.model';
import { TUser } from '@api/models/user.model';

export namespace AppActions {
  export class InitStore {
    public static readonly type = '[App] Init Store';
    constructor(public payload: TInitialApiResponse) {}
  }

  export class SetCurrentUserPermissions {
    public static readonly type = '[App] Set User Permissions';
    constructor(public payload: TUser) {}
  }

  export class ChangeUser {
    public static readonly type = '[App] Change User';
    constructor(public payload: TUser) {}
  }

  export class AddTopic {
    public static readonly type = '[App] Add Topic';
    constructor(public payload: TCreateTopic) {}
  }

  export class DeleteTopic {
    public static readonly type = '[App] Delete Topic';
    constructor(public payload: string) {}
  }

  export class AddCommentToTopic {
    public static readonly type = '[App] Add Comment to Topic';
    constructor(public payload: { topicId: string; comment: TCreateComment }) {}
  }

  export class AddCommentToComment {
    public static readonly type = '[App] Add Comment to Comment';
    constructor(
      public payload: {
        topicId: string;
        commentId: string;
        comment: TCreateComment;
      }
    ) {}
  }

  export class DeleteComment {
    public static readonly type = '[App] Delete Comment';
    constructor(public payload: { topicId: string; commentId: string }) {}
  }

  export class UpdateUser {
    public static readonly type = '[App] Update User';
    constructor(public payload: TUser) {}
  }

  export class UpdatePassword {
    public static readonly type = '[App] Update Password';
    constructor(
      public payload: {
        user: TUser;
        password: string;
        confirmPassword: string;
      }
    ) {}
  }

  export class CountCurrentUserTopicsComments {
    public static readonly type = '[App] Count Current User Topics Comments';
  }

  export class UpdateRole {
    public static readonly type = '[App] Update Role';
    constructor(public payload: TUpdateRole) {}
  }
}
