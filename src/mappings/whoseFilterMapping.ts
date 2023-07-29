import { Whose, WhoseFilter } from '@/constants.ts';
import { baseGenerator } from '@/mappings/baseGenerator.ts';

let _cache: Record<string, Whose> | null = null;
export const whoseFilterMapping = () => {
  if (!_cache) {
    _cache = baseGenerator<Whose>(WhoseFilter);
  }

  return _cache;
};
