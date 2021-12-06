export const JSONObjectValidator = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};
