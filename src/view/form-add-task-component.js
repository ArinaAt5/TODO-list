import { AbstractComponent } from "../framework/view/abstract-component.js";

function createFormAddTaskTemplate() {
  return `<form class="new-task">
        <h2>Новая задача</h2>
        <input id="add-task" type="text" placeholder="Название задачи..." required>
        <button type="submit">+Добавить</button>
      </form>`;
}


export default class FormAddTaskComponent extends AbstractComponent {
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    // Подписываемся на submit формы
    this.element.addEventListener("submit", this.#clickHandler);
  }

  get template() {
    return createFormAddTaskTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    if (typeof this.#handleClick === "function") {
      this.#handleClick();
    }
  };
}