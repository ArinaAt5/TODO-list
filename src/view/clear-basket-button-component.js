import { AbstractComponent } from "../framework/view/abstract-component.js";

function createClearBasketButtonTemplate() {
  return `<button class="clear-basket-btn" type="button">Очистить корзину</button>`;
}

export default class ClearBasketButtonComponent extends AbstractComponent {
  get template() {
    return createClearBasketButtonTemplate();
  }
}