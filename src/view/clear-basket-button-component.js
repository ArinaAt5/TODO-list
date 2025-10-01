import { createElement } from "../framework/render.js";

function createClearBasketButtonTemplate() {
  return `
    <button class="clear-basket-btn" type="button">Очистить корзину</button>
  `;
}

export default class ClearBasketButtonComponent {
  getTemplate() {
    return createClearBasketButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}