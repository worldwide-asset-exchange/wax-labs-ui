import { configData } from '@/api/chain/config';
import { Config } from '@/api/models/config.ts';

export async function isAdmin({ actor }: { actor: string }): Promise<boolean> {
  for (;;) {
    try {
      const { admin_acct } = (await configData()) as Config;

      return admin_acct === actor;
    } catch (e) {
      console.error('[isAdmin] Error', e);
    }
  }
}
