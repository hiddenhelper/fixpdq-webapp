export const truncateString = (str, len) => {
  if (str && str.length > len) {
    return str.slice(0, len) + "...";
  } else {
    return str;
  }
};
