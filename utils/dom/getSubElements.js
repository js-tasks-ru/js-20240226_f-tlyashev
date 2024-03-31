export function getSubElements(targetElement) {
  const subElements = {};
  const elements = targetElement.querySelectorAll("[data-element]");
  for (const element of elements) {
    subElements[element.dataset.element] = element;
  }
  return subElements;
}
