export function toggleView(element: HTMLDivElement) {
  const isGrid = element.dataset.view === 'grid';
  const value = isGrid ? 'list' : 'grid';

  localStorage.setItem('@WaxLabs:v1:proposal-view', value);
  element.dataset.view = value;
}

export const getDataViewDefault = localStorage.getItem('@WaxLabs:v1:proposal-view') ?? 'grid';
