import { sortStrings } from "../../utils/sort/sortStrings.js";
import { sortNumbers } from "../../utils/sort/sortNumbers.js";
import { createElement } from "../../utils/dom/createElement.js";

export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = createElement(this.createTableTemplate());
    this.getSubElements();
  }

  createTableTemplate() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createTableHeaderTemplate(this.headerConfig)}
        </div>
        <div data-element="body" class="sortable-table__body">
            ${this.createTableBodyTemplate(this.data)}
        </div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfy your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    `;
  }

  createTableHeaderTemplate(columns) {
    return columns
      .map((col) => {
        if (col.sortable) {
          return `
            <div class="sortable-table__cell" data-id="${col.id}" data-sortable="${col.sortable}" data-order>
              <span>${col.title}</span>
              <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
              </span>
            </div>
          `;
        }
        return `
          <div class="sortable-table__cell" data-id="${col.id}" data-sortable="false">
            <span>${col.title}</span>
          </div>
        `;
      })
      .join("");
  }

  createTableBodyTemplate(data) {
    return data
      .map(
        (rowData) =>
          `
          <a href="/products/${rowData.id}" class="sortable-table__row">
            ${this.headerConfig
              .map((config) =>
                this.createTableBodyColumnTemplate(config, rowData)
              )
              .join("")}
          </a>
        `
      )
      .join("");
  }

  createTableBodyColumnTemplate(config, rowData) {
    if (config.template) {
      return config.template(rowData[config.id]);
    }
    return `<div class="sortable-table__cell">${rowData[config.id]}</div>`;
  }

  getSubElements() {
    const elements = this.element.querySelectorAll("[data-element]");
    for (const element of elements) {
      this.subElements[element.dataset.element] = element;
    }
  }

  setColumnOrder(field, order) {
    const columns = this.element.querySelectorAll('[data-sortable="true"]');
    for (const column of columns) {
      if (column.dataset.id !== field) {
        column.dataset.order = "";
      } else {
        column.dataset.order = order;
      }
    }
  }

  sort(field, order) {
    this.setColumnOrder(field, order);

    const sortType = this.headerConfig.find(
      (config) => config.id === field
    ).sortType;

    switch (sortType) {
      case "string":
        sortStrings(this.data, field, order);
        break;
      case "number":
        sortNumbers(this.data, field, order);
        break;
    }

    this.subElements["body"].innerHTML = this.createTableBodyTemplate(
      this.data
    );
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
