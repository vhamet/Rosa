export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type User = {
  id: number;
  createdAt: Date;
  username: string;
  phone?: string;
  pictureUrl?: string;
};

export type Comment = {
  id: number;
  createdAt: Date;
  content: string;
  author: User;
};

export type Event = {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string;
  createdAt: string;
  createdBy: User;
  participants: User[];
  comments: Comment[];
};
export type EventItemProps = { event: Event };
