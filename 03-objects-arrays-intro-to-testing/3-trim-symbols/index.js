/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string.length === 0 || size <= 0) {
    return "";
  } else if (!size) {
    return string;
  }

  let result = "";
  let counter = 1;
  let prevChar = string[0];

  for (let i = 1; i < string.length; i++) {
    if (string[i] === prevChar) {
      counter++;
    } else {
      counter = 1;
      prevChar = string[i];
    }

    if (counter <= size) {
      result += string[i];
    }
  }

  return string[0] + result;
}
