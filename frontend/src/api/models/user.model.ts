import { ERoles } from '../enums/role.enum';

export type TUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: ERoles;
};
