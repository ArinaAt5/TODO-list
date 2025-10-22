import { AbstractComponent } from "../framework/view/abstract-component.js";

function createTaskTemplate(task) {
  const { title, status } = task;
  return `
    <li class="task-item task--${status}" data-id="${task.id}">
      <div class="task-body">
        <p class="task-title">${title}</p>
      </div>
    </li>
  `;
}

export default class TaskComponent extends AbstractComponent {
  #task = null;

  constructor({ task }) {
    super();
    this.#task = task;
    // Инициализация перетаскивания
    this.#afterCreate();
  }

  #afterCreate() {
    const el = this.element;
    this.#makeTaskDraggable(el);
    el.addEventListener('dragover', (e) => { e.preventDefault(); });
  }

  #makeTaskDraggable(element) {
    element.setAttribute('draggable', true);
    element.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('application/x-task-id', this.#task.id);
    });
  }

  get template() {
    return createTaskTemplate(this.#task);
  }
}