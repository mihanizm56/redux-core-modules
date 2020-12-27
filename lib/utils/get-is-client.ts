export const getIsClient = () =>
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement;
