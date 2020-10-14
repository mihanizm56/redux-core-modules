type ParamsType = {
  data: Array<any>;
  error: boolean;
  errorText: string;
  additionalErrors: any;
};

export const filterBatchedResponseData = (responseData: ParamsType) => {
  const dataItems = responseData.data.filter(item => !item.error);
  const dataErrors = responseData.data.filter(item => item.error);

  return { ...responseData, data: dataItems, additionalErrors: dataErrors };
};
