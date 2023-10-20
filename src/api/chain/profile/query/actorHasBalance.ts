import { accountBalance } from '@/api/chain/profile';
import { DRAFT_PROP_AMOUNT } from '@/constants.ts';

export async function accountHasBalance({
  actor,
  minRequiredBalance = DRAFT_PROP_AMOUNT,
}: {
  actor: string;
  minRequiredBalance?: number;
}): Promise<boolean> {
  const balance = await accountBalance({ actor });
  return balance >= minRequiredBalance;
}
