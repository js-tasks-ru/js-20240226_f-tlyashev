export default class NotificationMessage {
  static lastMessage;
  element;

  constructor(message = "", { duration = 0, type = "" } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.element = this.createElement(this.createTemplate());
  }

  createElement(template) {
    const element = document.createElement("div");

    element.innerHTML = template;

    return element.firstElementChild;
  }

  createTemplate() {
    return `
        <div class="notification ${this.type}" 
            style="--value:${this.duration / 1000}s">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        </div>
      `;
  }

  show(container = document.body) {
    if (NotificationMessage.lastMessage) {
      NotificationMessage.lastMessage.remove();
    }

    NotificationMessage.lastMessage = this;

    this.timerId = setTimeout(() => {
      this.destroy();
    }, this.duration);

    container.appendChild(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    clearTimeout(this.timerId);
  }
}
