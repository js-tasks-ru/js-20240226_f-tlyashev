class Tooltip {
  static instance;
  static indent = 9;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize() {
    this.createListeners();
  }

  handlePointerOver = (event) => {
    const tooltip = event.target.dataset.tooltip;
    if (!tooltip) {
      return;
    }
    this.render(tooltip);
  };

  handlePointerOut = () => {
    if (this.element?.isConnected) {
      this.remove();
    }
  };

  handlePointerMove = ({ clientX, clientY }) => {
    if (!this.element?.isConnected) {
      return;
    }

    let left = clientX + Tooltip.indent;
    const top = clientY + Tooltip.indent;

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  };

  render(text) {
    const template = this.createTemplate(text);
    this.element = this.createElement(template);
    document.body.append(this.element);
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate(text) {
    return `<div class="tooltip">${text}</div>`;
  }

  createListeners() {
    document.addEventListener("pointerover", this.handlePointerOver);
    document.addEventListener("pointerout", this.handlePointerOut);
    document.addEventListener("pointermove", this.handlePointerMove);
  }

  destroyListeners() {
    document.removeEventListener("pointerover", this.handlePointerOver);
    document.removeEventListener("pointerout", this.handlePointerOut);
    document.removeEventListener("pointermove", this.handlePointerMove);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

export default Tooltip;
