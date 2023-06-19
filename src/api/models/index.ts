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

export interface GetTableRowsResult<T> {
  rows: T[];
  more: boolean;
  next_key: string;
  next_key_bytes: string;
}
