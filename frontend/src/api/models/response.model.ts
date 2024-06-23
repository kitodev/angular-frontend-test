import { HttpStatusCode } from '@angular/common/http';
import { TRole } from './role.model';
import { TTopic } from './topic.model';
import { TUser } from './user.model';

type TResponse = {
  message: string;
  status: HttpStatusCode;
};

export type TInitialApiResponse = TResponse & {
  data: {
    roles: TRole[];
    topics: TTopic[];
    users: TUser[];
  };
};

export type TApiResponse<ResponseData> = TResponse & {
  data: ResponseData;
};
