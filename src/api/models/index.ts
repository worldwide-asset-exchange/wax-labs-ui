import { Checksum160, Checksum256, Float64, Name, UInt64, UInt128 } from '@wharfkit/antelope';
import { Session } from '@wharfkit/session';

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

export type TableIndexType = Name | UInt64 | UInt128 | Float64 | Checksum256 | Checksum160;

export interface GetTableRowsResult<T, K = TableIndexType> {
  rows: T[];
  more: boolean;
  next_key: K;
}

export interface WaxUser {
  actor: string;
  requestPermission: string;
}

export interface SessionProps {
  session: Session;
}
