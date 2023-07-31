import { ProposalStatusKey, ProposalStatusKeyName } from '@/constants.ts';
import { baseGenerator } from '@/mappings/baseGenerator.ts';

let _cache: Record<string, ProposalStatusKey> | null = null;
export const statusFilterMapping = () => {
  if (!_cache) {
    _cache = baseGenerator<ProposalStatusKey>(ProposalStatusKeyName);
  }

  return _cache;
};
