export interface Authorization {
  actor: string;
  permission: string;
}

export interface Action<T> {
  account: string;
  name: string;
  authorization: Authorization[];
  data: T;
}
