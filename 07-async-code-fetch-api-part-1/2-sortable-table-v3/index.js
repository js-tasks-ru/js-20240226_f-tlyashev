import fetchJson from "./utils/fetch-json.js";
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = "https://course-js.javascript.ru";
const OFFSET = 30;

export default class SortableTableV3 extends SortableTableV2 {
  start = 0;
  end = OFFSET;
  isLoading = false;

  constructor(
    headersConfig,
    { data = [], sorted = {}, url = "", isSortLocally = false } = {}
  ) {
    super(headersConfig, { data, sorted });
    this.url = url;
    this.isSortLocally = isSortLocally;
    this.render();
  }

  update() {
    this.subElements.body.innerHTML = this.createTableBodyTemplate(this.data);
  }

  prepareUrl(apiEndpoint, start, end, isSortLocally, sortOrder, sortField) {
    const url = new URL(apiEndpoint, BACKEND_URL);
    url.searchParams.set("_start", start);
    url.searchParams.set("_end", end);
    if (!isSortLocally && sortOrder && sortField) {
      url.searchParams.set("_order", sortOrder);
      url.searchParams.set("_sort", sortField);
    }
    return url;
  }

  async loadData() {
    const url = this.prepareUrl(
      this.url,
      this.start,
      this.end,
      this.isSortLocally,
      this.sortOrder,
      this.sortField
    );
    this.isLoading = true;
    const result = await fetchJson(url);
    this.data = [...this.data, ...result];
    this.isLoading = false;
  }

  async render() {
    this.subElements.loading.style.display = "block";
    await this.loadData();
    this.update();
    this.subElements.loading.style.display = "none";
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sortField, this.sortOrder);
    } else {
      this.sortOnServer(this.sortField, this.sortOrder);
    }
  }

  async sortOnClient(id, order) {
    super.sortOnClient(id, order);
  }

  async sortOnServer(id, order) {
    this.sortField = id;
    this.sortOrder = order;
    this.start = 0;
    this.end = OFFSET;
    this.data = [];
    await this.render();
  }

  async handleBodyScroll() {
    if (this.isLoading) {
      return;
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.start += OFFSET;
      this.end += OFFSET;
      await this.render();
    }
  }

  createEventListeners() {
    super.createEventListeners();
    this.handleBodyScroll = this.handleBodyScroll.bind(this);
    window.addEventListener("scroll", this.handleBodyScroll);
  }

  destroyEventListeners() {
    super.destroyEventListeners();
    window.removeEventListener("scroll", this.handleBodyScroll);
  }
}
