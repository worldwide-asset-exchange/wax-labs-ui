import i18n from '@/i18n';

export function baseGenerator<T>(objectToTranslate: Record<string, T>): Record<string, T> {
  return Object.entries(objectToTranslate).reduce(
    (previousValue, [key, value]) => ({
      ...previousValue,
      [i18n.t(key)]: value,
    }),
    {} as Record<string, T>
  );
}
