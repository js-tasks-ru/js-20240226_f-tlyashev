import { default as SortableTableV1 } from "../../05-dom-document-loading/2-sortable-table-v1/index.js";
export default class SortableTable extends SortableTableV1 {
  isSortLocally = true;

  sorted;

  onSortClick = (event) => {
    const sortableHeaderCell = event.target.closest("[data-sortable]");
    if (!sortableHeaderCell) {
      return;
    }
    const { id, order } = sortableHeaderCell.dataset;
    this.sorted = {
      id,
      order: order === "desc" ? "asc" : "desc",
    };
    this.sort();
  };

  constructor(
    headersConfig,
    {
      data = [],
      sorted = {
        id: headersConfig.find((item) => item.sortable).id,
        order: "asc",
      },
    } = {}
  ) {
    super(headersConfig, data);

    this.sorted = sorted;
    this.createListeners();
    this.sort();
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  createListeners() {
    this.subElements.header.addEventListener("pointerdown", this.onSortClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener(
      "pointerdown",
      this.onSortClick
    );
  }

  sortOnClient() {
    const { id, order } = this.sorted;
    super.sort(id, order);
  }

  sortOnServer() {
    return;
  }

  destroy = () => {
    super.destroy();
    this.destroyListeners();
  };
}
