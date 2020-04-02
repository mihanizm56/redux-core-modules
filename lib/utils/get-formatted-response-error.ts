import { ErrorTextParams } from '@/types';

const DEFAULT_ERROR_MESSAGE = 'Системная ошибка';

export const getFormattedResponseErrorText = ({
  errorTextKey,
  errorsMap,
}: ErrorTextParams) => {
  const formattedError = errorsMap[errorTextKey];

  return formattedError || DEFAULT_ERROR_MESSAGE;
};
