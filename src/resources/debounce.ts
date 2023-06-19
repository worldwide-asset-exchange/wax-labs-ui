type TimeoutHandle = ReturnType<typeof setTimeout>;

export function debounce<T extends (...args: any[]) => void>(func: T, delay = 1000): (...args: Parameters<T>) => void {
  let timeout: TimeoutHandle;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
