export const getIsClient = () =>
  Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  );
