export function sortStrings(arr, field, order = "desc") {
  if (order === "asc") {
    return arr.sort((a, b) =>
      a[field].localeCompare(b[field], ["ru", "en"], { caseFirst: "upper" })
    );
  }
  return arr.sort((a, b) =>
    b[field].localeCompare(a[field], ["ru", "en"], { caseFirst: "upper" })
  );
}
