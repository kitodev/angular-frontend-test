export type TRole = {
  id: string;
  name: string;
  rights: number;
};

export type TUpdateRole = Omit<TRole, 'rights'>;
