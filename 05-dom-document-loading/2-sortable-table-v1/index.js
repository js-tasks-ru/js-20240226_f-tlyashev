export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.createTemplateElement());
    this.selectSubElements();

    this.subElements.header.innerHTML = this.createHeaderTemplate();
    this.subElements.body.innerHTML = this.createBodyTemplate(this.data);
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplateElement() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
        
          <div data-element="header" class="sortable-table__header sortable-table__row"></div>
          <div data-element="body" class="sortable-table__body"></div>
          
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createHeaderTemplate(sortField = "", sortOrder = "") {
    return this.headerConfig
      .map(({ id, title, sortable }) => {
        return `
        <div 
          class="sortable-table__cell" 
          data-id="${id}" 
          data-sortable="${sortable}" 
          data-order="${sortOrder}"
        >
        <span>${title}</span>
          ${this.createSortArrowTemplate(sortField, id)}
        </div>
      `;
      })
      .join("");
  }

  createSortArrowTemplate(sortField = "", id = "") {
    if (sortField === id) {
      return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      `;
    }
    return "";
  }

  createBodyTemplate(data) {
    return data
      .map(
        (rowData) =>
          `
          <a href="/products/${rowData.id}" class="sortable-table__row">
            ${this.headerConfig
              .map((config) => this.createBodyColumn(config, rowData))
              .join("")}
          </a>
        `
      )
      .join("");
  }

  createBodyColumn(config, rowData) {
    if (config.template) {
      return config.template(rowData);
    }
    return `<div class="sortable-table__cell">${rowData[config.id]}</div>`;
  }

  sort(fieldName, orderName) {
    const sortedData = [...this.data].sort((a, b) => {
      const direction = orderName === "desc" ? -1 : 1;
      const value = a[fieldName];
      const nextValue = b[fieldName];

      if (typeof value === "string") {
        return (
          direction *
          value.localeCompare(nextValue, ["ru", "en"], { caseFirst: "upper" })
        );
      }
      return direction * (value - nextValue);
    });

    this.subElements.header.innerHTML = this.createHeaderTemplate(
      fieldName,
      orderName
    );
    this.subElements.body.innerHTML = this.createBodyTemplate(sortedData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
