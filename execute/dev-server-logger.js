module.exports.devServerLog = (type, ...values) => {
  switch (type) {
    case 'error':
      // eslint-disable-next-line
          console.error(...values);
      break;
    case 'info':
      // eslint-disable-next-line
          console.info(...values);
      break;
    case 'warn':
      // eslint-disable-next-line
          console.warn(...values);
      break;

    default:
      break;
  }
};
