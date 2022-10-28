import { getIsClient } from './get-is-client';

export const isFormData = (body?: JSON | FormData) => {
  if (!body) {
    return false;
  }

  const isNode = !getIsClient();

  if (isNode) {
    return body?.constructor?.name === 'FormData';
  }

  return body instanceof FormData;
};
