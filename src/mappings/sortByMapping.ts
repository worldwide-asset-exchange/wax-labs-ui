import { ProposalFilter, SortBy } from '@/constants.ts';
import { baseGenerator } from '@/mappings/baseGenerator.ts';

let _cache: Record<string, SortBy> | null = null;
export const sortByMapping = () => {
  if (!_cache) {
    _cache = baseGenerator<SortBy>(ProposalFilter);
  }

  return _cache;
};
