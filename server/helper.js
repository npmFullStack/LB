// helper.js
export const createResponse = (
  success,
  message,
  data = null,
  errors = null,
) => {
  return {
    success,
    message,
    data,
    errors,
  };
};
