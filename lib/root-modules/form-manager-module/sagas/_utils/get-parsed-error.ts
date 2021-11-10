type ParamsType = {
  error: any;
  sagaName: string;
};

// deserialize data from the "catch" block to be parsed
export const getParsedError = ({ error, sagaName }: ParamsType) => {
  try {
    const parsedErrorData = JSON.parse(error.message);

    return parsedErrorData;
  } catch (err: any) {
    console.error(`catch the error in ${sagaName}`, err);

    return err.message;
  }
};
