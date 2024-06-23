import { ERoles } from '../enums/role.enum';

export type TAuthor = {
  id: string;
  email: string;
  name: string;
  role: ERoles;
};

export type TComment = {
  id: string;
  author: TAuthor;
  body: string;
  comments: TComment[];
  removed?: boolean;
};

export type TTopic = {
  id: string;
  author: TAuthor;
  body: string;
  comments: TComment[];
  title: string;
};

export type TCreateTopic = Omit<TTopic, 'id' | 'comments'>;

export type TCreateComment = Omit<TComment, 'id' | 'comments'>;
