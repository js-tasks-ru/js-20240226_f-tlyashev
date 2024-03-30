export function sortNumbers(arr, field, order = "desc") {
  if (order === "asc") {
    return arr.sort((a, b) => a[field] - b[field]);
  }
  return arr.sort((a, b) => b[field] - a[field]);
}
