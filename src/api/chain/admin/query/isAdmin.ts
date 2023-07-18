import { configData } from '@/api/chain/config';
import { Config } from '@/api/models/config.ts';

export async function isAdmin({ accountName }: { accountName: string }): Promise<boolean> {
  for (;;) {
    try {
      const { admin_acct } = (await configData()) as Config;

      return admin_acct === accountName;
    } catch (e) {
      console.error('[isAdmin] Error', e);
    }
  }
}
